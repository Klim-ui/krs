"use client";

import { useState } from "react";
import { lookupMaxDialog } from "@/app/admin/actions";

export function MaxDialogFinder() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    chatIds: string[];
    userIds: string[];
    updateCount: number;
  } | null>(null);

  async function lookup() {
    setPending(true);
    setError("");
    try {
      setResult(await lookupMaxDialog());
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Не удалось получить ID",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-black/8 bg-white p-5 sm:p-7">
      <h2 className="font-serif text-2xl font-semibold">MAX-уведомления</h2>
      <p className="mt-2 text-sm leading-6 text-[#71685b]">
        Сначала напиши боту «Начать» в MAX, потом нажми кнопку. Число из адреса
        web.max.ru — не то. Сюда попадёт chat_id из API. Его нужно поставить в
        Railway → MAX_CHAT_ID.
      </p>
      <button
        type="button"
        onClick={lookup}
        disabled={pending}
        className="mt-4 rounded-xl bg-[#27231e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Спрашиваю MAX…" : "Получить ID диалога"}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {result && (
        <div className="mt-4 space-y-2 text-sm">
          <p>Событий: {result.updateCount}</p>
          <p>
            chat_id:{" "}
            <b>{result.chatIds.join(", ") || "пусто — напиши боту «Начать»"}</b>
          </p>
          <p>
            user_id: <b>{result.userIds.join(", ") || "пусто"}</b>
          </p>
        </div>
      )}
    </section>
  );
}
