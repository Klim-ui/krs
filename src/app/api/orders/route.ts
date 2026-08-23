import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, pools } from "@/db/schema";
import { sendReservationNotification } from "@/lib/telegram";
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

  try {
    const db = getDb();
    const result = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select id from ${pools} where ${pools.status} = 'ACTIVE' for update`,
      );

      const [pool] = await tx
        .select()
        .from(pools)
        .where(eq(pools.status, "ACTIVE"))
        .limit(1);

      if (!pool) throw new CapacityError("Сейчас нет открытого пула");

      const [reserved] = await tx
        .select({
          boxes:
            sql<number>`coalesce(sum(case when ${orders.status} <> 'REJECTED' then ${orders.boxCount} else 0 end), 0)::int`,
        })
        .from(orders)
        .where(eq(orders.poolId, pool.id));

      const remaining = pool.capacityBoxes - (reserved?.boxes ?? 0);
      if (parsed.data.boxCount > remaining) {
        throw new CapacityError(
          remaining > 0
            ? `Осталось только ${remaining} коробок`
            : "Этот пул уже заполнен",
        );
      }

      const [order] = await tx
        .insert(orders)
        .values({
          poolId: pool.id,
          name: parsed.data.name,
          phone: parsed.data.phone,
          locality: parsed.data.locality,
          boxCount: parsed.data.boxCount,
          pricePerKgSnapshot: pool.pricePerKg,
          estimatedWeightSnapshot: String(
            Number(pool.estimatedBoxWeight) * parsed.data.boxCount,
          ),
        })
        .returning({ id: orders.id });

      return { order, poolNumber: pool.number };
    });

    await sendReservationNotification({
      name: parsed.data.name,
      phone: parsed.data.phone,
      locality: parsed.data.locality,
      boxCount: parsed.data.boxCount,
      poolNumber: result.poolNumber,
    }).catch((error) => console.error("Telegram notification failed", error));

    return NextResponse.json({ ok: true, orderId: result.order.id });
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
