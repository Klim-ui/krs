import { Beef, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { BookingSection } from "@/components/booking-section";
import { FaqSection } from "@/components/faq-section";
import { StickyBookBar } from "@/components/sticky-book-bar";
import { getContacts } from "@/lib/contacts";
import {
  FRONT_PACK_KG,
  PART_PRICES,
  TOTAL_BACKS,
  TOTAL_PACKS,
  getCurrentPool,
} from "@/lib/orders";

function rub(value: number) {
  return `${(Math.round(value / 10) * 10).toLocaleString("ru-RU")} ₽`;
}

function upcomingDate(date: Date | null) {
  if (!date) return null;
  return date.getTime() > Date.now() - 24 * 60 * 60 * 1000 ? date : null;
}

// Фотодневник: реальные фото тёлок фермера, от полугода до сегодня.
const diary = [
  {
    src: "/photos/2025-12.webp",
    date: "Декабрь 2025",
    text: "Полгода. Только с подсоса — первые полгода были с мамками.",
    alt: "Две полугодовалые тёлки на сене зимой",
  },
  {
    src: "/photos/2026-04.webp",
    date: "Апрель 2026",
    text: "Сено, ячмень, овёс. Гуляют в своём загоне, без ускорителей.",
    alt: "Тёлки в загоне весной",
  },
  {
    src: "/photos/2026-06.webp",
    date: "Июнь 2026",
    text: "Год. Тот же корм: сено, ячмень, овёс. Набирают вес без спешки.",
    alt: "Тёлки отдыхают на сене летом",
  },
  {
    src: "/photos/heifers-now.webp",
    date: "Октябрь 2026",
    text: "Полтора года, под 400 кг живого веса. Вот они — все три.",
    alt: "Три тёлки в загоне осенью",
  },
];

const steps = [
  ["Бронь без денег", "Имя, телефон, село. Никаких переводов заранее."],
  ["Звонок фермера", "Подтвердим зад или набор и день доставки."],
  ["Забой после набора", "Ветэкспертиза. Мясо не лежит «на витрине»."],
  ["Весы у крыльца", "Взвешиваем при вас, платите по факту. Доставка бесплатно."],
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const pool = await getCurrentPool();
  const contacts = getContacts();
  const slaughterDate = upcomingDate(pool?.slaughterDate ?? null);
  const backKg = pool?.estimatedQuarterWeight ?? 50;

  return (
    <main className="overflow-hidden bg-[#fffdf9] pb-24 text-[#251f18] sm:pb-0">
      {/* Первый экран */}
      <section className="bg-[#f4eee3]">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-5 sm:px-8 lg:pb-20">
          <header className="flex items-center justify-between gap-3">
            <a href="#" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#47733d] text-white">
                <Beef className="size-5" />
              </span>
              <span className="leading-tight">
                <b className="block font-serif text-lg">Мясной Пул</b>
                <small className="text-[#635b50]">Таврическое</small>
              </span>
            </a>
            <div className="flex items-center gap-2">
              {contacts?.phoneHref ? (
                <a
                  href={contacts.phoneHref}
                  aria-label="Позвонить фермеру"
                  className="flex h-11 items-center gap-2 rounded-full border border-[#47733d]/40 px-3 text-sm font-semibold text-[#47733d] sm:px-4"
                >
                  <Phone className="size-4" />
                  <span className="hidden sm:inline">Позвонить</span>
                </a>
              ) : contacts?.messengerHref ? (
                <a
                  href={contacts.messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contacts.messengerLabel}
                  className="flex h-11 items-center gap-2 rounded-full border border-[#47733d]/40 px-3 text-sm font-semibold text-[#47733d] sm:px-4"
                >
                  <MessageCircle className="size-4" />
                  <span className="hidden sm:inline">Написать</span>
                </a>
              ) : null}
              <a
                href="#order"
                className="flex h-11 items-center rounded-full bg-[#9f2f24] px-4 text-sm font-semibold text-white sm:px-5"
              >
                Бронь без оплаты
              </a>
            </div>
          </header>

          <div className="grid items-center gap-8 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-14">
            <div className="min-w-0">
              <p className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-[#47733d]">
                <MapPin className="size-5" />
                Тавричанка → Таврический район и Омск
              </p>
              <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl">
                Домашняя говядина своих тёлок — на зиму, без предоплаты
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#4f473c]">
                Растил сам: полгода на подсосе, потом год на сене, ячмене и
                овсе. Зад — четвертью целиком, перед — наборами 10–15 кг. Платите
                после взвешивания у крыльца.
              </p>

              <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <b className="block text-2xl">≈ {rub(FRONT_PACK_KG * PART_PRICES.FRONT)}</b>
                  <small className="text-base text-[#635b50]">
                    набор переда ~{FRONT_PACK_KG} кг · {PART_PRICES.FRONT} ₽/кг
                  </small>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <b className="block text-2xl">≈ {rub(backKg * PART_PRICES.BACK)}</b>
                  <small className="text-base text-[#635b50]">
                    задняя четверть ~{backKg} кг · {PART_PRICES.BACK} ₽/кг
                  </small>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#order"
                  className="flex h-14 items-center justify-center rounded-xl bg-[#9f2f24] px-7 text-lg font-semibold text-white"
                >
                  Забронировать
                </a>
                {contacts?.messengerHref ? (
                  <a
                    href={contacts.messengerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#47733d] px-7 text-lg font-semibold text-[#47733d]"
                  >
                    <MessageCircle className="size-5" />
                    {contacts.messengerLabel}
                  </a>
                ) : (
                  <a
                    href="#tyolki"
                    className="flex h-14 items-center justify-center rounded-xl border-2 border-[#47733d] px-7 text-lg font-semibold text-[#47733d]"
                  >
                    Посмотреть тёлок
                  </a>
                )}
              </div>

              {pool ? (
                <p className="mt-5 text-base text-[#4f473c]">
                  {pool.status === "UPCOMING" || pool.isCurrentPoolFull ? (
                    <>
                      <b>Текущая тёлка набрана.</b> Записываем в очередь на
                      следующую.
                    </>
                  ) : (
                    <>
                      <b>Свободно сейчас:</b> задних четвертей —{" "}
                      {pool.remainingBacks}, наборов переда —{" "}
                      {pool.remainingPacks}.
                    </>
                  )}{" "}
                  Забой —{" "}
                  {slaughterDate
                    ? slaughterDate.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        timeZone: "Asia/Omsk",
                      })
                    : "когда наберём брони на тёлку"}
                  .
                </p>
              ) : null}
            </div>

            <figure className="relative">
              <Image
                src="/photos/2026-10.webp"
                alt="Тёлка смотрит в камеру, октябрь 2026"
                width={1000}
                height={750}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/3] w-full rounded-[1.75rem] object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold">
                Октябрь 2026, Тавричанка
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Фотодневник */}
      <section id="tyolki" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">
            Растут у меня с полугода
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4f473c]">
            Не перекуп и не магазин. Три тёлки герефорд и симментал, свой двор
            в Тавричанке. Вот как они росли.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {diary.map((item) => (
              <figure key={item.date}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1000}
                  height={750}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-3">
                  <b className="block font-serif text-xl">{item.date}</b>
                  <span className="mt-1 block text-base leading-7 text-[#4f473c]">
                    {item.text}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="bg-[#47733d] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Как это работает
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-4">
            {steps.map(([title, text], index) => (
              <li key={title} className="flex gap-4 sm:block">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-serif text-xl font-semibold text-[#47733d]">
                  {index + 1}
                </span>
                <span>
                  <b className="block font-serif text-xl sm:mt-3">{title}</b>
                  <span className="mt-1 block text-base leading-7 text-white/80">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          {pool ? (
            <p className="mt-8 text-base text-white/80">
              Всего на три тёлки: {TOTAL_BACKS} задних четвертей и {TOTAL_PACKS}{" "}
              наборов переда. Забронировано: {pool.totalReservedBacks} и{" "}
              {pool.totalReservedPacks}.
            </p>
          ) : null}
        </div>
      </section>

      {pool ? (
        <BookingSection
          currentHeadNumber={pool.number}
          remainingBacks={pool.remainingBacks}
          remainingPacks={pool.remainingPacks}
          totalRemainingBacks={pool.totalRemainingBacks}
          totalRemainingPacks={pool.totalRemainingPacks}
          estimatedQuarterWeight={pool.estimatedQuarterWeight}
          waitlistMode={pool.isCurrentPoolFull}
        />
      ) : (
        <section id="order" className="bg-[#f4eee3] py-20">
          <p className="px-5 py-10 text-center text-lg text-[#675e51]">
            Приём броней сейчас закрыт. Напишите фермеру — откроем набор.
            {contacts && (contacts.phoneHref || contacts.messengerHref) ? (
              <a
                href={contacts.phoneHref ?? contacts.messengerHref ?? undefined}
                className="mt-3 block font-semibold text-[#47733d]"
              >
                {contacts.phoneHref ? "Позвонить фермеру" : contacts.messengerLabel}
              </a>
            ) : null}
          </p>
        </section>
      )}

      <FaqSection contacts={contacts} />

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

      {pool && pool.totalRemainingQuarters > 0 ? (
        <StickyBookBar
          phoneHref={contacts?.phoneHref ?? undefined}
          messengerHref={contacts?.messengerHref ?? undefined}
        />
      ) : null}
    </main>
  );
}
