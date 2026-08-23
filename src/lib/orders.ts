import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";

export type CurrentPool = {
  id: string;
  number: number;
  capacityQuarters: number;
  reservedQuarters: number;
  remainingQuarters: number;
  estimatedQuarterWeight: number;
  pricePerKg: number;
  slaughterDate: Date | null;
};

export async function getCurrentPool(): Promise<CurrentPool | null> {
  const db = getDb();
  const [result] = await db
    .select({
      id: pools.id,
      number: pools.number,
      capacityQuarters: pools.capacityQuarters,
      estimatedQuarterWeight: pools.estimatedQuarterWeight,
      pricePerKg: pools.pricePerKg,
      slaughterDate: pools.slaughterDate,
      reservedQuarters:
        sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.quarterCount} else 0 end), 0)::int`,
    })
    .from(pools)
    .leftJoin(orders, eq(orders.poolId, pools.id))
    .where(eq(pools.status, "ACTIVE"))
    .groupBy(pools.id)
    .limit(1);

  if (!result) return null;

  return {
    ...result,
    estimatedQuarterWeight: Number(result.estimatedQuarterWeight),
    pricePerKg: Number(result.pricePerKg),
    remainingQuarters: Math.max(
      0,
      result.capacityQuarters - result.reservedQuarters,
    ),
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
        quarterCount: orders.quarterCount,
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
        capacityQuarters: pools.capacityQuarters,
        slaughterDate: pools.slaughterDate,
        createdAt: pools.createdAt,
      })
      .from(pools)
      .orderBy(desc(pools.number)),
  ]);

  const activeOrders = allOrders.filter((order) => order.status !== "REJECTED");
  const totalQuarters = activeOrders.reduce(
    (sum, order) => sum + order.quarterCount,
    0,
  );
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
    stats: { totalQuarters, totalWeight, potentialRevenue },
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
  capacityQuarters: number;
  estimatedQuarterWeight: number;
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
      capacityQuarters: input.capacityQuarters,
      estimatedQuarterWeight: String(input.estimatedQuarterWeight),
      pricePerKg: String(input.pricePerKg),
    });
  });
}
