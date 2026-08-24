"use client";

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
    title: "Пачка переда 10–15 кг",
    weight: "~12 кг",
    description:
      "Лопатка, шея, грудинка, рёбра, голяшка — с той же туши, просто меньше. Не магазинный набор.",
    price: PART_PRICES.front,
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
  const pricePerKg = PART_PRICES[selectedPart];
  const unitKg =
    selectedPart === "front" ? FRONT_PACK_KG : estimatedQuarterWeight;
  const estimatedPrice = Math.round(unitKg * pricePerKg);

  return (
    <>
      <section id="quarters" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f2f24]">
              Два формата
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Зад целиком. Перед — пачками.
            </h2>
            <p className="mt-4 text-lg text-[#6b6256]">
              Задняя четверть — 570 ₽/кг, пачка переда — 530 ₽/кг. Вес и сумма
              — после разделки на поверенных весах. Пачка не «коробка с
              прилавка»: режем перед той же тёлки на 10–15 кг.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {offers.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedPart(item.value)}
                className={`rounded-2xl border p-6 text-left ${
                  selectedPart === item.value
                    ? "border-[#47733d] bg-[#edf4e9]"
                    : "border-[#e5dccf] bg-white"
                }`}
              >
                <span className="text-sm font-semibold text-[#9f2f24]">
                  {item.weight} · {item.price} ₽/кг
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#71685b]">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#27231e] p-6 text-white sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-sm text-white/60">
                {selectedPart === "front"
                  ? `Пачка переда · ${pricePerKg.toLocaleString("ru-RU")} ₽/кг`
                  : `Задняя четверть · ${pricePerKg.toLocaleString("ru-RU")} ₽/кг`}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                Ориентировочно {estimatedPrice.toLocaleString("ru-RU")} ₽ за ~
                {unitKg} кг
              </p>
            </div>
            <span className="text-sm text-white/60">
              Точная сумма — по фактическому весу
            </span>
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
              Оставьте заявку
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#675e51]">
              {waitlistMode
                ? `Туша №${currentHeadNumber} набрана. Заявка встанет в очередь на следующую. Предоплата не нужна.`
                : "Зад — четверть целиком. Перед — пачка 10–15 кг. Если эта туша наберётся, поставим в очередь."}
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
