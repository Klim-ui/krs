"use client";

import { useState } from "react";

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
      const response = await fetch("/api/admin/max-dialog", {
        credentials: "include",
      });
      const data = (await response.json()) as {
        error?: string;
        chatIds?: string[];
        userIds?: string[];
        updateCount?: number;
      };
      if (!response.ok) {
        setError(data.error ?? "Не удалось получить ID");
        return;
      }
      setResult({
        chatIds: data.chatIds ?? [],
        userIds: data.userIds ?? [],
        updateCount: data.updateCount ?? 0,
      });
    } catch {
      setError("Не удалось получить ID");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-black/8 bg-white p-5 sm:p-7">
      <h2 className="font-serif text-2xl font-semibold">MAX-уведомления</h2>
      <p className="mt-2 text-sm leading-6 text-[#71685b]">
        Открой админку в обычном Chrome: https://www.krs-tavr.ru/admin — не
        через кнопку «Открыть» внутри MAX. Напиши боту «Начать», затем нажми
        кнопку. Полученный chat_id поставь в Railway → MAX_CHAT_ID.
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
