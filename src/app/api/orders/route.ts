import { asc, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";
import { sendReservationNotification } from "@/lib/max";
import {
  FRONT_PACK_KG,
  PART_PRICES,
  QUARTERS_PER_HEAD,
  TOTAL_HEADS,
  partTypeLabel,
  remainingSlots,
  toPartType,
} from "@/lib/orders";
import { orderSchema } from "@/lib/validation";

class CapacityError extends Error {}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Проверьте данные формы",
      },
      { status: 400 },
    );
  }

  const partType = toPartType(parsed.data.part_type);
  const pricePerKg = PART_PRICES[partType];

  try {
    const db = getDb();
    const result = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select id from ${pools} where ${pools.status} in ('ACTIVE', 'UPCOMING') for update`,
      );

      const openPools = await tx
        .select()
        .from(pools)
        .where(inArray(pools.status, ["ACTIVE", "UPCOMING"]))
        .orderBy(asc(pools.number));

      if (openPools.length === 0) {
        throw new CapacityError("Сейчас нет открытого пула");
      }

      const reservations = await tx
        .select({
          poolId: orders.poolId,
          partType: orders.partType,
          units:
            sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.quarterCount} else 0 end), 0)::int`,
        })
        .from(orders)
        .where(
          inArray(
            orders.poolId,
            openPools.map((pool) => pool.id),
          ),
        )
        .groupBy(orders.poolId, orders.partType);

      const kind = partType === "FRONT" ? "FRONT" : "BACK";

      let target = openPools.find((pool) => {
        const rows = reservations
          .filter((row) => row.poolId === pool.id)
          .map((row) => ({ partType: row.partType, units: row.units }));
        return remainingSlots(rows, kind) >= parsed.data.quarterCount;
      });

      if (!target) {
        const [lastPool] = await tx
          .select({ number: pools.number })
          .from(pools)
          .orderBy(sql`${pools.number} desc`)
          .limit(1);
        const nextNumber = (lastPool?.number ?? 0) + 1;

        if (nextNumber > TOTAL_HEADS) {
          throw new CapacityError(
            "Все задние четверти и пачки переда уже забронированы",
          );
        }

        const [created] = await tx
          .insert(pools)
          .values({
            number: nextNumber,
            status: "UPCOMING",
            capacityQuarters: QUARTERS_PER_HEAD,
            estimatedQuarterWeight: String(
              openPools[0]?.estimatedQuarterWeight ?? "50",
            ),
            pricePerKg: String(PART_PRICES.ANY),
          })
          .returning();
        target = created;
      }

      const activePool = openPools.find((pool) => pool.status === "ACTIVE");
      const waitlist = Boolean(
        activePool && target.number > activePool.number,
      );

      const [order] = await tx
        .insert(orders)
        .values({
          poolId: target.id,
          name: parsed.data.name,
          phone: parsed.data.phone,
          locality: parsed.data.locality,
          quarterCount: parsed.data.quarterCount,
          partType,
          pricePerKgSnapshot: String(pricePerKg),
          estimatedWeightSnapshot: String(
            (partType === "FRONT"
              ? FRONT_PACK_KG
              : Number(target.estimatedQuarterWeight)) *
              parsed.data.quarterCount,
          ),
        })
        .returning({ id: orders.id });

      return { order, waitlist };
    });

    await sendReservationNotification({
      name: parsed.data.name,
      phone: parsed.data.phone,
      locality: parsed.data.locality,
      quarterCount: parsed.data.quarterCount,
      partLabel: partTypeLabel(partType),
    }).catch((error) => console.error("MAX notification failed", error));

    return NextResponse.json({
      ok: true,
      orderId: result.order.id,
      waitlist: result.waitlist,
    });
  } catch (error) {
    if (error instanceof CapacityError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Reservation failed", error);
    return NextResponse.json(
      { error: "Не удалось сохранить бронь. Позвоните нам или попробуйте позже." },
      { status: 500 },
    );
  }
}
