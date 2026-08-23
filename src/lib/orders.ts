import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";

export const TOTAL_HEADS = 3;
export const QUARTERS_PER_HEAD = 4;
export const TOTAL_QUARTERS = TOTAL_HEADS * QUARTERS_PER_HEAD;

export const PART_PRICES = {
  FRONT: 530,
  BACK: 570,
  ANY: 550,
} as const;

export type PartType = keyof typeof PART_PRICES;

export type CurrentPool = {
  id: string;
  number: number;
  activeReservedQuarters: number;
  activeRemainingQuarters: number;
  totalReservedQuarters: number;
  totalRemainingQuarters: number;
  totalCapacityQuarters: number;
  estimatedQuarterWeight: number;
  slaughterDate: Date | null;
  isCurrentPoolFull: boolean;
};

export async function getCurrentPool(): Promise<CurrentPool | null> {
  const db = getDb();
  const [activePool] = await db
    .select()
    .from(pools)
    .where(eq(pools.status, "ACTIVE"))
    .orderBy(asc(pools.number))
    .limit(1);

  if (!activePool) return null;

  const [totals, activeTotals] = await Promise.all([
    db
      .select({
        reserved:
          sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.quarterCount} else 0 end), 0)::int`,
      })
      .from(orders),
    db
      .select({
        reserved:
          sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.quarterCount} else 0 end), 0)::int`,
      })
      .from(orders)
      .where(eq(orders.poolId, activePool.id)),
  ]);

  const totalReservedQuarters = Math.min(
    TOTAL_QUARTERS,
    totals[0]?.reserved ?? 0,
  );
  const activeReservedQuarters = activeTotals[0]?.reserved ?? 0;

  return {
    id: activePool.id,
    number: activePool.number,
    activeReservedQuarters,
    activeRemainingQuarters: Math.max(
      0,
      activePool.capacityQuarters - activeReservedQuarters,
    ),
    totalReservedQuarters,
    totalRemainingQuarters: Math.max(
      0,
      TOTAL_QUARTERS - totalReservedQuarters,
    ),
    totalCapacityQuarters: TOTAL_QUARTERS,
    estimatedQuarterWeight: Number(activePool.estimatedQuarterWeight),
    slaughterDate: activePool.slaughterDate,
    isCurrentPoolFull:
      activeReservedQuarters >= activePool.capacityQuarters,
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
        partType: orders.partType,
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
  await db.transaction(async (tx) => {
    await tx
      .update(pools)
      .set({ status: "CLOSED", closedAt: new Date() })
      .where(eq(pools.status, "ACTIVE"));

    const [nextPool] = await tx
      .select({ id: pools.id })
      .from(pools)
      .where(eq(pools.status, "UPCOMING"))
      .orderBy(asc(pools.number))
      .limit(1);

    if (nextPool) {
      await tx
        .update(pools)
        .set({ status: "ACTIVE", closedAt: null })
        .where(eq(pools.id, nextPool.id));
    }
  });
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
    const [activePool] = await tx
      .select({ id: pools.id })
      .from(pools)
      .where(eq(pools.status, "ACTIVE"))
      .limit(1);

    if (activePool) throw new Error("Сначала закройте текущий пул");

    const [lastPool] = await tx
      .select({ number: pools.number })
      .from(pools)
      .orderBy(desc(pools.number))
      .limit(1);

    if ((lastPool?.number ?? 0) >= TOTAL_HEADS) {
      throw new Error("Можно создать не более трёх пулов");
    }

    await tx.insert(pools).values({
      number: (lastPool?.number ?? 0) + 1,
      status: "ACTIVE",
      capacityQuarters: input.capacityQuarters,
      estimatedQuarterWeight: String(input.estimatedQuarterWeight),
      pricePerKg: String(input.pricePerKg),
    });
  });
}

export function toPartType(value: "front" | "back" | "any"): PartType {
  return value === "front" ? "FRONT" : value === "back" ? "BACK" : "ANY";
}

export function partTypeLabel(type: PartType) {
  return type === "FRONT"
    ? "Передняя"
    : type === "BACK"
      ? "Задняя"
      : "Любая";
}
