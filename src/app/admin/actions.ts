"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import {
  closeActivePool,
  createPool,
  setActivePoolSlaughterDate,
  updateOrderStatus,
} from "@/lib/orders";
import { poolSchema } from "@/lib/validation";

async function requireAdmin() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export async function changeOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = ["NEW", "CONFIRMED", "REJECTED", "DELIVERED"] as const;

  if (!allowed.includes(status as (typeof allowed)[number])) {
    throw new Error("Некорректный статус");
  }

  await updateOrderStatus(id, status as (typeof allowed)[number]);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addPool(formData: FormData) {
  await requireAdmin();
  const input = poolSchema.parse({
    capacityBoxes: formData.get("capacityBoxes"),
    estimatedBoxWeight: formData.get("estimatedBoxWeight"),
    pricePerKg: formData.get("pricePerKg"),
  });
  await createPool(input);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function closePool() {
  await requireAdmin();
  await closeActivePool();
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function setSlaughterDate(formData: FormData) {
  await requireAdmin();
  const value = String(formData.get("slaughterDate") ?? "");
  const date = new Date(`${value}T12:00:00+06:00`);
  if (!value || Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата");
  }

  await setActivePoolSlaughterDate(date);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
