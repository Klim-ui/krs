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
  const pricePerKg = PART_PRICES[selectedPart];
  const unitKg =
    selectedPart === "front" ? FRONT_PACK_KG : estimatedQuarterWeight;
  const estimatedPrice = Math.round(unitKg * pricePerKg);

  return (
    <>
      <section id="quarters" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f2f24]">
              Два формата
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Зад целиком. Перед — семейными наборами.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#6b6256]">
              Передик тёлки-герефорда 1,5 года — на тушение, фарш и супы. Четверть
              ~50 кг рубим на наборы 10–15 кг. Не ссыпаем кости в одну коробку,
              а мякоть в другую: пилим поперёк, каждому одинаковый микс.
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

          <div className="mt-12 rounded-[1.75rem] border border-[#e5dccf] bg-[#f4eee3] p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
              Честный разруб набора ~12 кг
            </h3>
            <p className="mt-3 text-base leading-7 text-[#635b50]">
              40% мякоти на фарш, 30% рёбер, 20% антрекотов, 10% суповых
              косточек. Куски под кастрюлю, в пищевой пакет, в плотную коробку
              ~40×30 см.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {mix.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-5"
                >
                  <p className="text-sm font-semibold text-[#9f2f24]">
                    {item.share} · {item.weight}
                  </p>
                  <h4 className="mt-1 font-serif text-xl font-semibold">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[#71685b]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#27231e] p-6 text-white sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-sm text-white/60">
                {selectedPart === "front"
                  ? `Набор переда · ${pricePerKg.toLocaleString("ru-RU")} ₽/кг · вес ~10–15 кг`
                  : `Задняя четверть · ${pricePerKg.toLocaleString("ru-RU")} ₽/кг`}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                Ориентировочно {estimatedPrice.toLocaleString("ru-RU")} ₽ за ~
                {unitKg} кг
              </p>
            </div>
            <span className="max-w-xs text-sm leading-6 text-white/60">
              Точный вес — на электронных весах у крыльца. Оплата по факту.
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
                : "Зад — четверть целиком. Перед — набор 10–15 кг. Если эта туша наберётся, поставим в очередь."}
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
