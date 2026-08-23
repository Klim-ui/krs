import {
  BadgeCheck,
  Beef,
  CalendarDays,
  MapPin,
  PackageCheck,
  Sprout,
  Truck,
} from "lucide-react";
import { ReservationForm } from "@/components/reservation-form";
import { getCurrentPool } from "@/lib/orders";

export const dynamic = "force-dynamic";

const quarterContents = [
  ["Передняя четверть", "~45–55 кг", "Лопатка, шея, грудинка, рёбра и голяшка"],
  ["Задняя четверть", "~45–55 кг", "Тазобедренная часть, вырезка, край и голяшка"],
];

export default async function Home() {
  const pool = await getCurrentPool();
  const progress = pool
    ? Math.min(
        100,
        Math.round((pool.reservedQuarters / pool.capacityQuarters) * 100),
      )
    : 0;
  const estimatedPrice = pool
    ? Math.round(pool.estimatedQuarterWeight * pool.pricePerKg)
    : 0;

  return (
    <main className="overflow-hidden">
      <section className="relative bg-[#f4eee3]">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#7b6d59_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 lg:pb-24">
          <header className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#47733d] text-white">
                <Beef className="size-5" />
              </span>
              <span className="leading-tight">
                <b className="block font-serif text-lg">Мясной Пул</b>
                <small className="text-[#6e6558]">Таврическое</small>
              </span>
            </a>
            <a
              href="#order"
              className="hidden rounded-full border border-[#9f2f24] px-5 py-2.5 text-sm font-semibold text-[#9f2f24] transition hover:bg-[#9f2f24] hover:text-white sm:block"
            >
              Забронировать
            </a>
          </header>

          <div className="grid items-center gap-12 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-sm font-medium text-[#47733d] shadow-sm">
                <MapPin className="size-4" />
                Таврический район и Омск
              </div>
              <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#251f18] sm:text-6xl lg:text-7xl">
                Домашняя говядина{" "}
                <span className="text-[#9f2f24]">от фермера</span> — прямо к
                вашему столу
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#635b50]">
                Молодые герефорды на зерне и сене. Продаём четвертинами туши,
                доставляем после забоя и ветеринарной экспертизы. Без
                предоплаты.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#order"
                  className="flex h-14 items-center justify-center rounded-xl bg-[#9f2f24] px-7 font-semibold text-white shadow-lg shadow-[#9f2f24]/15 transition hover:bg-[#85261d]"
                >
                  Забронировать набор
                </a>
                <a
                  href="#quarters"
                  className="flex h-14 items-center justify-center rounded-xl bg-white/70 px-7 font-semibold text-[#302a22] transition hover:bg-white"
                >
                  Что входит в четверть
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-[#66543a]/10 backdrop-blur sm:p-8">
              {pool ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#47733d]">
                        Сейчас собираем
                      </p>
                      <h2 className="mt-1 font-serif text-3xl font-semibold">
                        Партия №{pool.number}
                      </h2>
                    </div>
                    <span className="rounded-full bg-[#edf4e9] px-3 py-1.5 text-sm font-semibold text-[#47733d]">
                      {progress}%
                    </span>
                  </div>
                  <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#ded5c6]">
                    <div
                      className="h-full rounded-full bg-[#47733d] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="font-semibold">
                      Забронировано {pool.reservedQuarters} из{" "}
                      {pool.capacityQuarters}
                    </span>
                    <span className="text-[#71685b]">
                      Осталось {pool.remainingQuarters}
                    </span>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#f4eee3] p-4">
                      <PackageCheck className="mb-2 size-5 text-[#9f2f24]" />
                      <b className="block text-xl">
                        ~{pool.estimatedQuarterWeight} кг
                      </b>
                      <small className="text-[#71685b]">одна четверть туши</small>
                    </div>
                    <div className="rounded-2xl bg-[#f4eee3] p-4">
                      <CalendarDays className="mb-2 size-5 text-[#9f2f24]" />
                      <b className="block text-xl">
                        {pool.slaughterDate
                          ? pool.slaughterDate.toLocaleDateString("ru-RU")
                          : "После сбора"}
                      </b>
                      <small className="text-[#71685b]">дата забоя</small>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <Beef className="mx-auto size-10 text-[#9f2f24]" />
                  <h2 className="mt-4 font-serif text-2xl font-semibold">
                    Новый пул скоро откроется
                  </h2>
                  <p className="mt-2 text-[#71685b]">
                    Следите за обновлениями или свяжитесь с нами.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="quarters" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f2f24]">
              Продажа четвертинами
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Четверть молодой говяжьей туши
            </h2>
            <p className="mt-4 text-lg text-[#6b6256]">
              Цена единая — 550 ₽ за килограмм. Точный вес и сумма определяются
              после разделки на поверенных весах.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {quarterContents.map(([title, weight, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e5dccf] p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#66543a]/8"
              >
                <span className="text-sm font-semibold text-[#9f2f24]">
                  {weight}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#71685b]">
                  {description}
                </p>
              </article>
            ))}
          </div>
          {pool && (
            <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#27231e] p-6 text-white sm:flex-row sm:items-center sm:px-8">
              <div>
                <p className="text-sm text-white/60">
                  Цена {pool.pricePerKg.toLocaleString("ru-RU")} ₽/кг
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  Ориентировочно {estimatedPrice.toLocaleString("ru-RU")} ₽ за
                  четверть
                </p>
              </div>
              <span className="text-sm text-white/60">
                Точная сумма — по фактическому весу
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#47733d] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-3 sm:px-8">
          <div className="flex gap-4">
            <Sprout className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                Натуральный откорм
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Сено, зерно и чистая вода. Без ускорителей роста.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <BadgeCheck className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                Свои герефорды
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Животные выращены на нашем подворье до 1,5 лет.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Truck className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                Доставка рядом
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Таврический район и Омск в согласованный день.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="bg-[#f4eee3] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f2f24]">
              Бронь без оплаты
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Забронируйте четверть туши
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#675e51]">
              Заполните форму. Мы позвоним, уточним адрес и ответим на вопросы.
              Деньги заранее переводить не нужно.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-[#66543a]/8 sm:p-9">
            {pool && pool.remainingQuarters > 0 ? (
              <ReservationForm maxQuarters={pool.remainingQuarters} />
            ) : (
              <p className="py-10 text-center text-[#675e51]">
                Приём броней временно закрыт.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#27231e] py-8 text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Мясной Пул Таврическое</span>
          <a href="/admin/login" className="transition hover:text-white">
            Вход для фермера
          </a>
        </div>
      </footer>
    </main>
  );
}
