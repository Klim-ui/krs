import { asc, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";
import { sendReservationNotification } from "@/lib/max";
import {
  PART_PRICES,
  QUARTERS_PER_HEAD,
  TOTAL_HEADS,
  partTypeLabel,
  remainingSlots,
} from "@/lib/orders";
import { orderSchema, requestedQuarters } from "@/lib/validation";

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

  const requested = requestedQuarters(parsed.data);
  if (requested.back + requested.front < 1) {
    return NextResponse.json(
      { error: "Выберите хотя бы одну четверть" },
      { status: 400 },
    );
  }

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

      // Зад и перед одной заявки кладём на одну тушу — чтобы забирать в один день.
      let target = openPools.find((pool) => {
        const rows = reservations
          .filter((row) => row.poolId === pool.id)
          .map((row) => ({ partType: row.partType, units: row.units }));
        return (
          remainingSlots(rows, "BACK") >= requested.back &&
          remainingSlots(rows, "FRONT") >= requested.front
        );
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
            "Столько четвертей на одну тушу уже не осталось. Позвоните или напишите — подберём вариант.",
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
            pricePerKg: String(PART_PRICES.BACK),
          })
          .returning();
        target = created;
      }

      const pool = target;
      const activePool = openPools.find((open) => open.status === "ACTIVE");
      const waitlist = Boolean(activePool && pool.number > activePool.number);

      const items = (
        [
          ["BACK", requested.back],
          ["FRONT", requested.front],
        ] as const
      ).filter(([, count]) => count > 0);

      const created = await tx
        .insert(orders)
        .values(
          items.map(([partType, count]) => ({
            poolId: pool.id,
            name: parsed.data.name,
            phone: parsed.data.phone,
            locality: parsed.data.locality,
            quarterCount: count,
            partType,
            pricePerKgSnapshot: String(PART_PRICES[partType]),
            estimatedWeightSnapshot: String(
              Number(pool.estimatedQuarterWeight) * count,
            ),
          })),
        )
        .returning({ id: orders.id });

      return { order: created[0], waitlist };
    });

    const partsText = [
      requested.back > 0
        ? `${partTypeLabel("BACK")} × ${requested.back}`
        : null,
      requested.front > 0
        ? `${partTypeLabel("FRONT")} × ${requested.front}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    await sendReservationNotification({
      name: parsed.data.name,
      phone: parsed.data.phone,
      locality: parsed.data.locality,
      quarterCount: 1,
      partLabel: result.waitlist ? `${partsText} (очередь)` : partsText,
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
