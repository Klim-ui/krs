type ReservationMessage = {
  name: string;
  phone: string;
  locality: string;
  boxCount: number;
  poolNumber: number;
};

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const text = [
    "🥩 Новая бронь",
    "",
    `Пул: №${order.poolNumber}`,
    `Имя: ${order.name}`,
    `Телефон: ${order.phone}`,
    `Населённый пункт: ${order.locality}`,
    `Коробок: ${order.boxCount}`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(5_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API returned ${response.status}`);
  }
}
