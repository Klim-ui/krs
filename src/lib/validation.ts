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
  quarterCount: z.coerce.number().int().min(1).max(4),
  part_type: z.enum(["front", "back", "any"]),
  selectedPrice: z.coerce.number().optional(),
  website: z.string().max(0).optional().default(""),
}).superRefine((data, ctx) => {
  if (data.part_type === "back" && data.quarterCount > 2) {
    ctx.addIssue({
      code: "custom",
      message: "Заднюю четверть можно взять не больше двух за раз",
      path: ["quarterCount"],
    });
  }
});

export const poolSchema = z.object({
  capacityQuarters: z.coerce.number().int().min(1).max(4),
  estimatedQuarterWeight: z.coerce.number().min(20).max(100),
  pricePerKg: z.coerce.number().min(1).max(100_000),
});
