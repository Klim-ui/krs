"use client";

import Image from "next/image";
import { useState } from "react";
import {
  type PartChoice,
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
    description:
      "Тазобедренная часть, вырезка, толстый и тонкий край, голяшка. Стейки, отбивные, жаркое, гуляш.",
    price: PART_PRICES.back,
  },
  {
    value: "front",
    title: "Передняя четверть целиком",
    weight: "~45–55 кг",
    description:
      "Лопатка, шея, грудинка, рёбра, голяшка. Фарш, тушение, борщ, шурпа, холодец.",
    price: PART_PRICES.front,
  },
];

const tips = [
  {
    title: "Отдаём целиком, на кости",
    text: "Четверть — как есть после разруба туши. Делите дома на куски под свою семью.",
  },
  {
    title: "Вес — при вас",
    text: "Взвешиваем при вас, когда приезжаете. Платите только за то, что показали весы.",
  },
  {
    title: "Забираете сами",
    text: "Доставки нет. Приезжаете в Таврическое — адрес и время скажу, когда позвоню подтвердить бронь.",
  },
  {
    title: "Куда положить",
    text: "Четверть ~50 кг — это морозильный ларь. Многие берут одну четверть на две семьи.",
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
            Что вы забираете
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
                  {Math.round(estimatedQuarterWeight * item.price).toLocaleString(
                    "ru-RU",
                  )}{" "}
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
                Как это устроено
              </h3>
              <ul className="mt-5 divide-y divide-[#e5dccf] border-y border-[#e5dccf]">
                {tips.map((item) => (
                  <li key={item.title} className="py-4">
                    <b className="font-serif text-xl">{item.title}</b>
                    <p className="mt-1 text-base leading-7 text-[#4f473c]">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
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
                : "Оставьте имя и телефон — я перезвоню, подтвержу бронь и скажу, когда и куда приезжать. Деньги — только на месте, после взвешивания."}
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
