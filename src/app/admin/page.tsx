import {
  Beef,
  Box,
  LogOut,
  Plus,
  RussianRuble,
  Scale,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { MaxDialogFinder } from "@/components/max-dialog-finder";
import { StatusSelect } from "@/components/status-select";
import { isAuthenticated } from "@/lib/auth";
import { getAdminData, partTypeLabel } from "@/lib/orders";
import {
  addPool,
  closePool,
  logout,
  setSlaughterDate,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const data = await getAdminData();
  const activePool = data.pools.find((pool) => pool.status === "ACTIVE");
  const activeReservedQuarters = activePool
    ? data.orders
        .filter(
          (order) =>
            order.poolNumber === activePool.number &&
            order.status !== "REJECTED",
        )
        .reduce((sum, order) => sum + order.quarterCount, 0)
    : 0;
  const freeQuarters = activePool
    ? Math.max(
        0,
        activePool.capacityQuarters - activeReservedQuarters,
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-[#27231e]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#47733d] text-white">
              <Beef className="size-5" />
            </span>
            <div>
              <b className="block">Мясной Пул</b>
              <span className="text-xs text-[#71685b]">CRM фермера</span>
            </div>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#71685b] hover:bg-black/5 hover:text-black">
              <LogOut className="size-4" />
              Выйти
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#47733d]">Обзор</p>
            <h1 className="mt-1 font-serif text-4xl font-semibold">
              Заявки и пулы
            </h1>
          </div>
          {activePool && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <form action={setSlaughterDate} className="flex gap-2">
                <input
                  name="slaughterDate"
                  type="date"
                  required
                  defaultValue={
                    activePool.slaughterDate
                      ? activePool.slaughterDate.toISOString().slice(0, 10)
                      : ""
                  }
                  className="rounded-xl border border-black/10 bg-white px-3 text-sm"
                />
                <button className="rounded-xl bg-[#47733d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#395f31]">
                  Назначить забой
                </button>
              </form>
              <form action={closePool}>
                <button className="h-full w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Закрыть пул №{activePool.number}
                </button>
              </form>
            </div>
          )}
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={Users}
            label="Всего заявок"
            value={String(data.orders.length)}
          />
          <Stat
            icon={Box}
            label="Свободно в текущем пуле"
            value={activePool ? `${freeQuarters} четверти` : "Пул закрыт"}
          />
          <Stat
            icon={Scale}
            label="Расчётный вес"
            value={`${data.stats.totalWeight.toLocaleString("ru-RU")} кг`}
          />
          <Stat
            icon={RussianRuble}
            label="Потенциальная выручка"
            value={`${Math.round(data.stats.potentialRevenue).toLocaleString("ru-RU")} ₽`}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Заявки</h2>
              <p className="mt-1 text-sm text-[#71685b]">
                Новые заявки показаны первыми
              </p>
            </div>
            <a
              href="/api/admin/orders/export"
              className="text-sm font-semibold text-[#47733d] hover:underline"
            >
              Скачать CSV
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf9f7] text-xs uppercase tracking-wide text-[#71685b]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Клиент</th>
                  <th className="px-5 py-3 font-semibold">Телефон</th>
                  <th className="px-5 py-3 font-semibold">Откуда</th>
                  <th className="px-5 py-3 font-semibold">Пул / четверти</th>
                  <th className="px-5 py-3 font-semibold">Часть</th>
                  <th className="px-5 py-3 font-semibold">Дата</th>
                  <th className="px-5 py-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {data.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf9f7]">
                    <td className="px-5 py-4 font-semibold">{order.name}</td>
                    <td className="px-5 py-4">
                      <a
                        href={`tel:${order.phone}`}
                        className="hover:text-[#47733d] hover:underline"
                      >
                        {order.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4">{order.locality}</td>
                    <td className="px-5 py-4">
                      №{order.poolNumber} / {order.quarterCount}
                    </td>
                    <td className="px-5 py-4">{partTypeLabel(order.partType)}</td>
                    <td className="px-5 py-4 text-[#71685b]">
                      {order.createdAt.toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <StatusSelect id={order.id} status={order.status} />
                    </td>
                  </tr>
                ))}
                {data.orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-[#71685b]"
                    >
                      Заявок пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {!activePool && data.pools.length < 3 && (
          <section className="mt-8 rounded-2xl border border-black/8 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#edf4e9] text-[#47733d]">
                <Plus className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-semibold">
                  Открыть новый пул
                </h2>
                <p className="text-sm text-[#71685b]">
                  Предыдущий пул останется в истории
                </p>
              </div>
            </div>
            <form
              action={addPool}
              className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <Field
                name="capacityQuarters"
                label="Количество четвертей"
                defaultValue="4"
              />
              <Field
                name="estimatedQuarterWeight"
                label="Вес четверти, кг"
                defaultValue="50"
                step="0.1"
              />
              <Field
                name="pricePerKg"
                label="Цена за кг, ₽"
                defaultValue="550"
                step="1"
              />
              <button className="h-12 self-end rounded-xl bg-[#47733d] px-6 font-semibold text-white hover:bg-[#395f31]">
                Открыть пул
              </button>
            </form>
          </section>
        )}

        <MaxDialogFinder />
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5">
      <Icon className="size-5 text-[#47733d]" />
      <p className="mt-4 text-sm text-[#71685b]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  step = "1",
}: {
  name: string;
  label: string;
  defaultValue: string;
  step?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type="number"
        min="1"
        step={step}
        required
        defaultValue={defaultValue}
        className="h-12 rounded-xl border border-black/12 px-4 text-base outline-none focus:border-[#47733d]"
      />
    </label>
  );
}
