import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { findMaxDialogs } from "@/lib/max";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужно войти в CRM" }, { status: 401 });
  }

  try {
    return NextResponse.json(await findMaxDialogs());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Не удалось спросить MAX",
      },
      { status: 502 },
    );
  }
}
