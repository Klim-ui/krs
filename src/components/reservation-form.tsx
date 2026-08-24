"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

export type PartChoice = "front" | "back" | "any";

const PART_PRICES: Record<PartChoice, number> = {
  front: 530,
  back: 570,
  any: 550,
};

const PART_OPTIONS: Array<{
  value: PartChoice;
  title: string;
  details: string;
}> = [
  {
    value: "front",
    title: "Передняя четверть",
    details: "~45–55 кг: лопатка, шея, грудинка, рёбра",
  },
  {
    value: "back",
    title: "Задняя четверть",
    details: "~45–55 кг: тазобедренная часть, вырезка, край",
  },
  {
    value: "any",
    title: "Не важно / любая часть",
    details: "Соберём честно из доступных четвертей",
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
  currentRemaining,
  totalRemaining,
  estimatedWeight,
  selectedPart,
  onPartChange,
}: {
  currentHeadNumber: number;
  currentRemaining: number;
  totalRemaining: number;
  estimatedWeight: number;
  selectedPart: PartChoice;
  onPartChange: (value: PartChoice) => void;
}) {
  const [phone, setPhone] = useState("+7");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<"booked" | "waitlist" | null>(null);
  const [error, setError] = useState("");
  const waitlist = currentRemaining < 1 && totalRemaining > 0;
  const maxQuarters = Math.min(4, waitlist ? totalRemaining : currentRemaining);
  const pricePerKg = PART_PRICES[selectedPart];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
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
        quarterCount: form.get("quarterCount"),
        part_type: selectedPart,
        selectedPrice: pricePerKg,
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

  if (totalRemaining < 1) {
    return (
      <p className="py-10 text-center text-[#675e51]">
        Все 12 четвертей уже забронированы.
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
        <legend className="text-sm font-medium">Часть туши</legend>
        {PART_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
              selectedPart === option.value
                ? "border-[#47733d] bg-[#edf4e9]"
                : "border-[#d8cdbd] bg-white"
            }`}
          >
            <input
              type="radio"
              name="part_type"
              value={option.value}
              checked={selectedPart === option.value}
              onChange={() => onPartChange(option.value)}
              className="mt-1"
            />
            <span>
              <b className="block">{option.title}</b>
              <small className="text-[#71685b]">{option.details}</small>
              <small className="mt-1 block font-semibold text-[#9f2f24]">
                {PART_PRICES[option.value]} ₽/кг · ~
                {Math.round(
                  estimatedWeight * PART_PRICES[option.value],
                ).toLocaleString("ru-RU")}{" "}
                ₽
              </small>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        Количество четвертей
        <select
          name="quarterCount"
          className="h-14 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d]"
        >
          {Array.from({ length: maxQuarters }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} {index === 0 ? "четверть" : "четверти"}
            </option>
          ))}
        </select>
      </label>

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
          disabled={pending || maxQuarters < 1}
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
