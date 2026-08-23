"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyPassword(password))) {
    redirect("/admin/login?error=1");
  }

  await createSession();
  redirect("/admin");
}
