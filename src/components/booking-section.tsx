"use client";

import { useState } from "react";
import {
  type PartChoice,
  PART_PRICES,
  ReservationForm,
} from "@/components/reservation-form";

const quarterContents: Array<{
  value: PartChoice;
  title: string;
  weight: string;
  description: string;
  price: number;
}> = [
  {
    value: "front",
    title: "Передняя четверть",
    weight: "~45–55 кг",
    description: "Лопатка, шея, грудинка, рёбра и голяшка",
    price: PART_PRICES.front,
  },
  {
    value: "back",
    title: "Задняя четверть",
    weight: "~45–55 кг",
    description: "Тазобедренная часть, вырезка, край и голяшка",
    price: PART_PRICES.back,
  },
  {
    value: "any",
    title: "Любая четверть",
    weight: "~45–55 кг",
    description: "Поставим из того, что останется. Честно, без «одних мослов».",
    price: PART_PRICES.any,
  },
];

export function BookingSection({
  currentHeadNumber,
  currentRemaining,
  totalRemaining,
  estimatedWeight,
  waitlistMode,
}: {
  currentHeadNumber: number;
  currentRemaining: number;
  totalRemaining: number;
  estimatedWeight: number;
  waitlistMode: boolean;
}) {
  const [selectedPart, setSelectedPart] = useState<PartChoice>("any");
  const pricePerKg = PART_PRICES[selectedPart];
  const estimatedPrice = Math.round(estimatedWeight * pricePerKg);

  return (
    <>
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
              Передняя — 530 ₽/кг, задняя — 570 ₽/кг, любая часть — 550 ₽/кг.
              Точный вес и сумма определяются после разделки на поверенных весах.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {quarterContents.map((item) => (
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
                Цена {pricePerKg.toLocaleString("ru-RU")} ₽/кг за{" "}
                {selectedPart === "front"
                  ? "переднюю четверть"
                  : selectedPart === "back"
                    ? "заднюю четверть"
                    : "любую часть"}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                Ориентировочно {estimatedPrice.toLocaleString("ru-RU")} ₽ за
                четверть ~{estimatedWeight} кг
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
              Забронируйте четверть туши
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#675e51]">
              {waitlistMode
                ? `Туша №${currentHeadNumber} набрана. Заявка встанет в очередь на следующую. Предоплата не нужна.`
                : "Выберите часть и оставьте телефон. Если эта туша наберётся — поставим в очередь на следующую. Предоплата не нужна."}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-[#66543a]/8 sm:p-9">
            <ReservationForm
              currentHeadNumber={currentHeadNumber}
              currentRemaining={currentRemaining}
              totalRemaining={totalRemaining}
              estimatedWeight={estimatedWeight}
              selectedPart={selectedPart}
              onPartChange={setSelectedPart}
            />
          </div>
        </div>
      </section>
    </>
  );
}
