"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { trackBooking } from "@/lib/metrika";

export type PartChoice = "front" | "back";
export type PartCounts = Record<PartChoice, number>;

const PART_PRICES: Record<PartChoice, number> = {
  front: 550,
  back: 600,
};

const PART_OPTIONS: Array<{
  value: PartChoice;
  title: string;
  details: string;
}> = [
  {
    value: "back",
    title: "Задняя четверть целиком",
    details: "~45–55 кг на кости: тазобедренная, вырезка, край, голяшка",
  },
  {
    value: "front",
    title: "Передняя четверть целиком",
    details: "~45–55 кг на кости: лопатка, шея, грудинка, рёбра, голяшка",
  },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
  const normalized = digits.startsWith("7") ? digits.slice(1) : digits;
  const parts = [
    normalized.slice(0, 3),
    normalized.slice(3, 6),
    normalized.slice(6, 8),
    normalized.slice(8, 10),
  ];

  let result = "+7";
  if (parts[0]) result += ` (${parts[0]}`;
  if (parts[0].length === 3) result += ")";
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}

export function ReservationForm({
  currentHeadNumber,
  remainingBacks,
  remainingPacks,
  totalRemainingBacks,
  totalRemainingPacks,
  estimatedQuarterWeight,
  counts,
  onCountsChange,
}: {
  currentHeadNumber: number;
  remainingBacks: number;
  remainingPacks: number;
  totalRemainingBacks: number;
  totalRemainingPacks: number;
  estimatedQuarterWeight: number;
  counts: PartCounts;
  onCountsChange: (value: PartCounts) => void;
}) {
  const [phone, setPhone] = useState("+7");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<"booked" | "waitlist" | null>(null);
  const [error, setError] = useState("");
  const maxByPart: PartCounts = {
    back: Math.min(2, totalRemainingBacks),
    front: Math.min(2, totalRemainingPacks),
  };
  const back = Math.min(counts.back, maxByPart.back);
  const front = Math.min(counts.front, maxByPart.front);
  const totalQuarters = back + front;
  // Если на текущую тушу не влезает — заявка уйдёт в очередь на следующую.
  const waitlist =
    totalQuarters > 0 && (back > remainingBacks || front > remainingPacks);
  const estimatedTotal = Math.round(
    estimatedQuarterWeight * (back * PART_PRICES.back + front * PART_PRICES.front),
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    if (totalQuarters < 1) {
      setPending(false);
      setError("Выберите хотя бы одну четверть");
      return;
    }
    if (phone.replace(/\D/g, "").length !== 11) {
      setPending(false);
      setError("Введите российский номер полностью");
      return;
    }
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone,
        locality: form.get("locality"),
        backCount: back,
        frontCount: front,
        website: form.get("website"),
      }),
    });
    const data = (await response.json()) as {
      error?: string;
      waitlist?: boolean;
    };

    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Не удалось отправить заявку");
      return;
    }
    setSuccess(data.waitlist ? "waitlist" : "booked");
    trackBooking(Boolean(data.waitlist));
  }

  if (success) {
    return (
      <div className="rounded-3xl bg-[#f2eadc] p-7 text-center sm:p-10">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-[#47733d]" />
        <h3 className="font-serif text-3xl font-semibold text-[#241f18]">
          {success === "waitlist" ? "Вы в листе ожидания" : "Бронь принята"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[#675e51]">
          {success === "waitlist"
            ? "Место на следующую тушу закреплено. Мы позвоним, когда откроем следующую партию. Предоплата не нужна."
            : "Мы позвоним, чтобы подтвердить заказ, и ещё раз свяжемся за три дня до забоя. Предоплата не нужна."}
        </p>
      </div>
    );
  }

  if (totalRemainingBacks < 1 && totalRemainingPacks < 1) {
    return (
      <p className="py-10 text-center text-[#675e51]">
        Все четверти уже забронированы.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Ваше имя
        <input
          name="name"
          required
          minLength={2}
          autoComplete="name"
          placeholder="Евгений"
          className="h-14 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Телефон
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
          className="h-14 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        Населённый пункт
        <input
          name="locality"
          required
          minLength={2}
          autoComplete="address-level2"
          placeholder="Таврическое"
          className="h-14 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
        />
      </label>

      <fieldset className="grid gap-3 sm:col-span-2">
        <legend className="text-sm font-medium">
          Сколько четвертей — можно взять и зад, и перед
        </legend>
        {PART_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={`grid gap-3 rounded-2xl border p-4 transition sm:grid-cols-[1fr_auto] sm:items-center ${
              (option.value === "back" ? back : front) > 0
                ? "border-[#47733d] bg-[#edf4e9]"
                : "border-[#d8cdbd] bg-white"
            }`}
          >
            <span>
              <b className="block">{option.title}</b>
              <small className="text-[#71685b]">{option.details}</small>
              <small className="mt-1 block font-semibold text-[#9f2f24]">
                {PART_PRICES[option.value]} ₽/кг · ~
                {Math.round(
                  estimatedQuarterWeight * PART_PRICES[option.value],
                ).toLocaleString("ru-RU")}{" "}
                ₽ за четверть
              </small>
            </span>
            <select
              aria-label={`${option.title}: количество`}
              value={option.value === "back" ? back : front}
              onChange={(event) =>
                onCountsChange({
                  back,
                  front,
                  [option.value]: Number(event.target.value),
                })
              }
              disabled={maxByPart[option.value] < 1}
              className="h-14 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] disabled:opacity-50"
            >
              {Array.from(
                { length: maxByPart[option.value] + 1 },
                (_, index) => (
                  <option key={index} value={index}>
                    {index === 0
                      ? "Не нужно"
                      : index === 1
                        ? "1 четверть"
                        : "2 четверти"}
                  </option>
                ),
              )}
            </select>
          </div>
        ))}
        {totalQuarters > 0 ? (
          <p className="text-base font-semibold">
            Ориентировочно {estimatedTotal.toLocaleString("ru-RU")} ₽ за ~
            {Math.round(estimatedQuarterWeight * totalQuarters)} кг. Точная
            сумма — по весам.
          </p>
        ) : null}
      </fieldset>

      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />

      {error && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          disabled={pending || totalQuarters < 1}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#9f2f24] px-6 font-semibold text-white transition hover:bg-[#85261d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <LoaderCircle className="size-5 animate-spin" />}
          {pending
            ? "Сохраняем бронь…"
            : waitlist
              ? "Записаться в лист ожидания на следующую тушу"
              : "Забронировать без предоплаты"}
        </button>
        {waitlist && (
          <p className="mt-3 text-sm leading-6 text-[#675e51]">
            Туша №{currentHeadNumber} набрана. Заявка встанет в очередь на
            следующую. Предоплата не нужна.
          </p>
        )}
        <p className="mt-3 text-center text-xs leading-5 text-[#746b5e]">
          Нажимая кнопку, вы соглашаетесь на{" "}
          <a href="/privacy" className="underline">
            обработку персональных данных
          </a>
          . Оплата только после получения. Точная сумма — по фактическому весу.
        </p>
      </div>
    </form>
  );
}

export { PART_PRICES };
