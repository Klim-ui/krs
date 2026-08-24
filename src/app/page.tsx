import {
  Beef,
  CalendarDays,
  MapPin,
  PackageCheck,
  Scale,
  Sprout,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { BookingSection } from "@/components/booking-section";
import { StickyBookBar } from "@/components/sticky-book-bar";
import { getCurrentPool } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function Home() {
  const pool = await getCurrentPool();
  const progress = pool
    ? Math.min(
        100,
        Math.round(
          (pool.totalReservedQuarters / pool.totalCapacityQuarters) * 100,
        ),
      )
    : 0;

  return (
    <main className="overflow-hidden pb-24 sm:pb-0">
      <section className="relative bg-[#f4eee3]">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#7b6d59_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 lg:pb-24">
          <header className="flex items-center justify-between gap-3">
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
              className="rounded-full bg-[#9f2f24] px-4 py-2.5 text-sm font-semibold text-white sm:px-5"
            >
              Бронь без оплаты
            </a>
          </header>

          <div className="grid items-center gap-10 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-20">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-sm font-medium text-[#47733d] shadow-sm">
                <MapPin className="size-4" />
                Таврический район и Омск
              </div>
              <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#251f18] sm:text-6xl lg:text-7xl">
                Четверть туши от фермера.{" "}
                <span className="text-[#9f2f24]">Без предоплаты.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#635b50]">
                Молодые тёлки-герефорды 1,5 года на зерне и сене. Забой — когда
                наберём пул. Привезём до крыльца, взвесим на поверенных весах.
                Платите после осмотра. Мясо не лежит в магазине.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#order"
                  className="flex h-14 items-center justify-center rounded-xl bg-[#9f2f24] px-7 font-semibold text-white"
                >
                  Забронировать четверть
                </a>
                <a
                  href="#quarters"
                  className="flex h-14 items-center justify-center rounded-xl bg-white/70 px-7 font-semibold text-[#302a22]"
                >
                  Что входит в четверть
                </a>
              </div>
            </div>

            <div className="order-first lg:order-none">
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[#ded5c6] sm:aspect-[4/5]">
                  <Image
                    src="/heifer.jpg"
                    alt="Тёлка-герефорд 1,5 года на нашем подворье в Таврическом"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-[center_35%]"
                  />
                </div>
                <div className="relative z-10 mx-2 -mt-10 rounded-[1.75rem] border border-white/80 bg-white p-5 sm:mx-4 sm:-mt-14 sm:p-6">
                  {pool ? (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#47733d]">
                            {pool.status === "UPCOMING" || pool.isCurrentPoolFull
                              ? "Лист ожидания"
                              : "Сейчас собираем"}
                          </p>
                          <h2 className="mt-1 font-serif text-3xl font-semibold">
                            {pool.status === "UPCOMING" || pool.isCurrentPoolFull
                              ? `Очередь на тушу №${pool.number}`
                              : `Идет бронирование: туша №${pool.number}`}
                          </h2>
                        </div>
                        <span className="rounded-full bg-[#edf4e9] px-3 py-1.5 text-sm font-semibold text-[#47733d]">
                          {progress}%
                        </span>
                      </div>
                      <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#ded5c6]">
                        <div
                          className="h-full rounded-full bg-[#47733d]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="font-semibold">
                          Забронировано {pool.totalReservedQuarters} из{" "}
                          {pool.totalCapacityQuarters} четвертей
                        </span>
                        <span className="text-[#71685b]">
                          Осталось {pool.totalRemainingQuarters}
                        </span>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-[#f4eee3] p-4">
                          <PackageCheck className="mb-2 size-5 text-[#9f2f24]" />
                          <b className="block text-xl">
                            ~{pool.estimatedQuarterWeight} кг
                          </b>
                          <small className="text-[#71685b]">
                            одна четверть туши
                          </small>
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
                    <div className="py-6 text-center">
                      <Beef className="mx-auto size-10 text-[#9f2f24]" />
                      <h2 className="mt-4 font-serif text-2xl font-semibold">
                        Набор скоро откроем
                      </h2>
                      <p className="mt-2 text-[#71685b]">
                        Оставьте заявку ниже — поставим в очередь на первую тушу.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-4 sm:px-8">
          {[
            ["1", "Бронь без денег", "Имя, телефон, село. Никаких переводов заранее."],
            ["2", "Звонок фермера", "Подтвердим четверть и день доставки."],
            ["3", "Забой после набора", "Ветэкспертиза. Не держим мясо «на витрине»."],
            ["4", "Весы при вас", "Платите по факту. Доставка до крыльца бесплатно."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-2xl border border-[#e5dccf] p-5">
              <span className="font-serif text-2xl font-semibold text-[#9f2f24]">
                {step}
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#71685b]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {pool ? (
        <BookingSection
          currentHeadNumber={pool.number}
          currentRemaining={pool.activeRemainingQuarters}
          totalRemaining={pool.totalRemainingQuarters}
          estimatedWeight={pool.estimatedQuarterWeight}
          waitlistMode={pool.isCurrentPoolFull}
        />
      ) : (
        <section id="order" className="bg-[#f4eee3] py-20">
          <p className="px-5 py-10 text-center text-lg text-[#675e51]">
            Приём броней сейчас закрыт. Напишите фермеру — откроем набор.
          </p>
        </section>
      )}

      <section className="bg-[#47733d] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-3 sm:px-8">
          <div className="flex gap-4">
            <Scale className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                Без предоплаты и обвеса
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Сумма — после разделки на поверенных весах. Платите, когда
                мясо у вас.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Sprout className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                Свои тёлки-герефорды 1,5 года
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Зерно, сено, вода. Без ускорителей. Четверть туши, не набор
                «из обрезков».
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Truck className="mt-1 size-7 shrink-0 text-[#d9c79e]" />
            <div>
              <h3 className="font-serif text-xl font-semibold">
                До крыльца бесплатно
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Таврический район и Омск в день забоя. Не жарится в дороге
                сутками.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#27231e] py-8 text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Мясной Пул Таврическое</span>
          <div className="flex gap-4">
            <a href="/privacy" className="transition hover:text-white">
              Персональные данные
            </a>
            <a href="/admin/login" className="transition hover:text-white">
              Вход для фермера
            </a>
          </div>
        </div>
      </footer>

      {pool && pool.totalRemainingQuarters > 0 ? <StickyBookBar /> : null}
    </main>
  );
}
