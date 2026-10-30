"use client";

import Image from "next/image";
import { useState } from "react";
import {
  type PartChoice,
  FRONT_PACK_KG,
  PART_PRICES,
  ReservationForm,
} from "@/components/reservation-form";

const offers: Array<{
  value: PartChoice;
  title: string;
  weight: string;
  description: string;
  price: number;
}> = [
  {
    value: "back",
    title: "Задняя четверть целиком",
    weight: "~45–55 кг",
    description: "Тазобедренная, вырезка, край, голяшка. В морозилку до весны.",
    price: PART_PRICES.back,
  },
  {
    value: "front",
    title: "Набор из переда 10–15 кг",
    weight: "~12 кг",
    description:
      "Переднюю четверть пилим поперёк. В каждой коробке мякоть, рёбра, антрекот и немного супового — не одни мослы.",
    price: PART_PRICES.front,
  },
];

const mix = [
  {
    share: "40%",
    weight: "~4,5–5 кг",
    title: "Мякоть без кости",
    text: "Лопатка и шея. Фарш, гуляш, азу, котлеты, пельмени.",
  },
  {
    share: "30%",
    weight: "~3,5 кг",
    title: "Рёбра и грудинка",
    text: "Запечь, потушить с картошкой, на мангал, в борщ или шурпу.",
  },
  {
    share: "20%",
    weight: "~2–2,5 кг",
    title: "Стейки на кости",
    text: "Толстый край / антрекот. Сковорода или фольга в духовке.",
  },
  {
    share: "10%",
    weight: "~1–1,5 кг",
    title: "Суповой набор",
    text: "Лытка и сахарные косточки с мясом. Холодец и бульон.",
  },
];

export function BookingSection({
  currentHeadNumber,
  remainingBacks,
  remainingPacks,
  totalRemainingBacks,
  totalRemainingPacks,
  estimatedQuarterWeight,
  waitlistMode,
}: {
  currentHeadNumber: number;
  remainingBacks: number;
  remainingPacks: number;
  totalRemainingBacks: number;
  totalRemainingPacks: number;
  estimatedQuarterWeight: number;
  waitlistMode: boolean;
}) {
  const [selectedPart, setSelectedPart] = useState<PartChoice>("front");

  return (
    <>
      <section id="quarters" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">
            Что приедет
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {offers.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedPart(item.value)}
                className={`rounded-2xl border-2 p-6 text-left ${
                  selectedPart === item.value
                    ? "border-[#47733d] bg-[#edf4e9]"
                    : "border-[#e5dccf] bg-white"
                }`}
              >
                <span className="text-base font-semibold text-[#9f2f24]">
                  {item.weight} · {item.price} ₽/кг · ≈{" "}
                  {Math.round(
                    (item.value === "front" ? FRONT_PACK_KG : estimatedQuarterWeight) *
                      item.price,
                  ).toLocaleString("ru-RU")}{" "}
                  ₽
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-[#4f473c]">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <figure>
              <Image
                src="/photos/meat.webp"
                alt="Разруб говядины на кости"
                width={1000}
                height={1192}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-2 text-sm text-[#635b50]">
                Наш разруб, июнь 2025
              </figcaption>
            </figure>
            <div>
              <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
                Что в наборе переда ~12 кг
              </h3>
              <p className="mt-3 text-lg leading-8 text-[#4f473c]">
                Четверть пилим поперёк — каждому одинаково, не одни мослы.
                Упаковано в пакеты, коробка ~40×30 см влезает в морозилку.
              </p>
              <ul className="mt-5 divide-y divide-[#e5dccf] border-y border-[#e5dccf]">
                {mix.map((item) => (
                  <li key={item.title} className="py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <b className="font-serif text-xl">{item.title}</b>
                      <span className="shrink-0 text-base font-semibold text-[#9f2f24]">
                        {item.weight}
                      </span>
                    </div>
                    <p className="mt-1 text-base leading-7 text-[#4f473c]">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-base text-[#635b50]">
                Точный вес — на весах у вашего крыльца. Платите по факту.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="bg-[#f4eee3] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Забронировать без оплаты
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4f473c]">
              {waitlistMode
                ? "Текущая тёлка набрана. Заявка встанет в очередь на следующую. Предоплата не нужна."
                : "Оставьте имя и телефон — я перезвоню, подтвержу бронь и договоримся о дне доставки. Деньги — только когда мясо у вас."}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-[#66543a]/8 sm:p-9">
            <ReservationForm
              currentHeadNumber={currentHeadNumber}
              remainingBacks={remainingBacks}
              remainingPacks={remainingPacks}
              totalRemainingBacks={totalRemainingBacks}
              totalRemainingPacks={totalRemainingPacks}
              estimatedQuarterWeight={estimatedQuarterWeight}
              selectedPart={selectedPart}
              onPartChange={setSelectedPart}
            />
          </div>
        </div>
      </section>
    </>
  );
}
