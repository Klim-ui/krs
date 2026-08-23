type ReservationMessage = {
  name: string;
  phone: string;
  locality: string;
  quarterCount: number;
  poolNumber: number;
};

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.MAX_BOT_TOKEN;
  const chatId = process.env.MAX_CHAT_ID;

  // MAX integration becomes active automatically after both values are added.
  if (!token || !chatId) return;

  const text = [
    "🥩 Новая бронь мяса",
    "",
    `Партия: №${order.poolNumber}`,
    `Имя: ${order.name}`,
    `Телефон: ${order.phone}`,
    `Населённый пункт: ${order.locality}`,
    `Заказ: ${order.quarterCount} четверть туши`,
  ].join("\n");

  const url = new URL("https://platform-api2.max.ru/messages");
  url.searchParams.set("chat_id", chatId);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, notify: true }),
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `MAX API returned ${response.status}${details ? `: ${details}` : ""}`,
    );
  }
}
