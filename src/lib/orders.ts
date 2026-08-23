import { and, desc, eq, ne, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";

export type CurrentPool = {
  id: string;
  number: number;
  capacityBoxes: number;
  reservedBoxes: number;
  remainingBoxes: number;
  estimatedBoxWeight: number;
  pricePerKg: number;
  slaughterDate: Date | null;
};

export async function getCurrentPool(): Promise<CurrentPool | null> {
  const db = getDb();
  const [result] = await db
    .select({
      id: pools.id,
      number: pools.number,
      capacityBoxes: pools.capacityBoxes,
      estimatedBoxWeight: pools.estimatedBoxWeight,
      pricePerKg: pools.pricePerKg,
      slaughterDate: pools.slaughterDate,
      reservedBoxes:
        sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.boxCount} else 0 end), 0)::int`,
    })
    .from(pools)
    .leftJoin(orders, eq(orders.poolId, pools.id))
    .where(eq(pools.status, "ACTIVE"))
    .groupBy(pools.id)
    .limit(1);

  if (!result) return null;

  return {
    ...result,
    estimatedBoxWeight: Number(result.estimatedBoxWeight),
    pricePerKg: Number(result.pricePerKg),
    remainingBoxes: Math.max(0, result.capacityBoxes - result.reservedBoxes),
  };
}

export async function getAdminData() {
  const db = getDb();
  const [allOrders, allPools] = await Promise.all([
    db
      .select({
        id: orders.id,
        name: orders.name,
        phone: orders.phone,
        locality: orders.locality,
        boxCount: orders.boxCount,
        status: orders.status,
        estimatedWeight: orders.estimatedWeightSnapshot,
        pricePerKg: orders.pricePerKgSnapshot,
        createdAt: orders.createdAt,
        poolNumber: pools.number,
      })
      .from(orders)
      .innerJoin(pools, eq(orders.poolId, pools.id))
      .orderBy(desc(orders.createdAt)),
    db
      .select({
        id: pools.id,
        number: pools.number,
        status: pools.status,
        capacityBoxes: pools.capacityBoxes,
        slaughterDate: pools.slaughterDate,
        createdAt: pools.createdAt,
      })
      .from(pools)
      .orderBy(desc(pools.number)),
  ]);

  const activeOrders = allOrders.filter((order) => order.status !== "REJECTED");
  const totalBoxes = activeOrders.reduce((sum, order) => sum + order.boxCount, 0);
  const totalWeight = activeOrders.reduce(
    (sum, order) => sum + Number(order.estimatedWeight),
    0,
  );
  const potentialRevenue = activeOrders.reduce(
    (sum, order) =>
      sum + Number(order.estimatedWeight) * Number(order.pricePerKg),
    0,
  );

  return {
    orders: allOrders,
    pools: allPools,
    stats: { totalBoxes, totalWeight, potentialRevenue },
  };
}

export async function updateOrderStatus(
  id: string,
  status: "NEW" | "CONFIRMED" | "REJECTED" | "DELIVERED",
) {
  const db = getDb();
  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id));
}

export async function closeActivePool() {
  const db = getDb();
  await db
    .update(pools)
    .set({ status: "CLOSED", closedAt: new Date() })
    .where(eq(pools.status, "ACTIVE"));
}

export async function setActivePoolSlaughterDate(date: Date) {
  const db = getDb();
  await db
    .update(pools)
    .set({ slaughterDate: date })
    .where(eq(pools.status, "ACTIVE"));
}

export async function createPool(input: {
  capacityBoxes: number;
  estimatedBoxWeight: number;
  pricePerKg: number;
}) {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx
      .update(pools)
      .set({ status: "CLOSED", closedAt: new Date() })
      .where(eq(pools.status, "ACTIVE"));

    const [lastPool] = await tx
      .select({ number: pools.number })
      .from(pools)
      .orderBy(desc(pools.number))
      .limit(1);

    if ((lastPool?.number ?? 0) >= 3) {
      throw new Error("Можно создать не более трёх пулов");
    }

    await tx.insert(pools).values({
      number: (lastPool?.number ?? 0) + 1,
      capacityBoxes: input.capacityBoxes,
      estimatedBoxWeight: String(input.estimatedBoxWeight),
      pricePerKg: String(input.pricePerKg),
    });
  });
}

export async function reservationExists(phone: string) {
  const db = getDb();
  const [existing] = await db
    .select({ id: orders.id })
    .from(orders)
    .innerJoin(pools, eq(orders.poolId, pools.id))
    .where(
      and(
        eq(orders.phone, phone),
        ne(orders.status, "REJECTED"),
        eq(pools.status, "ACTIVE"),
      ),
    )
    .limit(1);

  return Boolean(existing);
}
