import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[^\d+]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^(?:\+7|7|8)\d{10}$/, "Введите российский номер телефона"),
    )
    .transform((value) => `+7${value.replace(/^\+?7|^8/, "")}`),
  locality: z.string().trim().min(2, "Укажите населённый пункт").max(100),
  // Новый формат: сколько задних и передних четвертей в одной заявке.
  backCount: z.coerce
    .number()
    .int()
    .min(0)
    .max(2, "Задних четвертей — не больше двух за раз")
    .optional(),
  frontCount: z.coerce
    .number()
    .int()
    .min(0)
    .max(2, "Передних четвертей — не больше двух за раз")
    .optional(),
  // Старый формат (одна часть на заявку) — на случай открытой старой страницы.
  quarterCount: z.coerce.number().int().min(1).max(2).optional(),
  part_type: z.enum(["front", "back", "any"]).optional(),
  selectedPrice: z.coerce.number().optional(),
  website: z.string().max(0).optional().default(""),
});

/** Сколько задних и передних четвертей просит заявка (оба формата). */
export function requestedQuarters(data: {
  backCount?: number;
  frontCount?: number;
  quarterCount?: number;
  part_type?: "front" | "back" | "any";
}) {
  if (data.backCount !== undefined || data.frontCount !== undefined) {
    return { back: data.backCount ?? 0, front: data.frontCount ?? 0 };
  }
  const count = data.quarterCount ?? 1;
  return data.part_type === "front"
    ? { back: 0, front: count }
    : { back: count, front: 0 };
}

export const poolSchema = z.object({
  capacityQuarters: z.coerce.number().int().min(1).max(4),
  estimatedQuarterWeight: z.coerce.number().min(20).max(100),
  pricePerKg: z.coerce.number().min(1).max(100_000),
});
