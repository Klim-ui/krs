"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

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

export function ReservationForm({ maxBoxes }: { maxBoxes: number }) {
  const [phone, setPhone] = useState("+7");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone,
        locality: form.get("locality"),
        boxCount: form.get("boxCount"),
        website: form.get("website"),
      }),
    });
    const data = (await response.json()) as { error?: string };

    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Не удалось отправить заявку");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-3xl bg-[#f2eadc] p-7 text-center sm:p-10">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-[#47733d]" />
        <h3 className="font-serif text-3xl font-semibold text-[#241f18]">
          Бронь принята
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[#675e51]">
          Мы позвоним, чтобы подтвердить заказ, и ещё раз свяжемся за три дня до
          забоя. Предоплата не нужна.
        </p>
      </div>
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
          className="h-13 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
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
          className="h-13 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Населённый пункт
        <input
          name="locality"
          required
          minLength={2}
          autoComplete="address-level2"
          placeholder="Таврическое"
          className="h-13 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Количество коробок
        <select
          name="boxCount"
          className="h-13 rounded-xl border border-[#d8cdbd] bg-white px-4 text-base outline-none transition focus:border-[#47733d]"
        >
          {Array.from({ length: Math.min(5, maxBoxes) }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
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
          disabled={pending || maxBoxes < 1}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#9f2f24] px-6 font-semibold text-white transition hover:bg-[#85261d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <LoaderCircle className="size-5 animate-spin" />}
          {pending ? "Сохраняем бронь…" : "Забронировать без предоплаты"}
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-[#746b5e]">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          Оплата только после получения.
        </p>
      </div>
    </form>
  );
}
