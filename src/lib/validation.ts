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
  boxCount: z.coerce.number().int().min(1).max(5),
  website: z.string().max(0).optional().default(""),
});

export const poolSchema = z.object({
  capacityBoxes: z.coerce.number().int().min(1).max(100),
  estimatedBoxWeight: z.coerce.number().min(1).max(100),
  pricePerKg: z.coerce.number().min(1).max(100_000),
});
