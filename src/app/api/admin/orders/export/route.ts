import { isAuthenticated } from "@/lib/auth";
import { getAdminData } from "@/lib/orders";

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { orders } = await getAdminData();
  const rows = [
    ["Дата", "Имя", "Телефон", "Населённый пункт", "Пул", "Четвертей", "Часть", "Статус"],
    ...orders.map((order) => [
      order.createdAt.toLocaleString("ru-RU"),
      order.name,
      order.phone,
      order.locality,
      order.poolNumber,
      order.quarterCount,
      order.partType,
      order.status,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders.csv"',
    },
  });
}
