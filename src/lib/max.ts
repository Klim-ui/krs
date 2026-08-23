type ReservationMessage = {
  name: string;
  phone: string;
  locality: string;
  quarterCount: number;
  poolNumber: number;
  partLabel: string;
  waitlist: boolean;
};

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.MAX_BOT_TOKEN;
  const userId = process.env.MAX_USER_ID;
  const chatId = process.env.MAX_CHAT_ID;

  // Personal user delivery takes priority over group chat delivery.
  if (!token || (!userId && !chatId)) return;

  const text = [
    order.waitlist
      ? "🔥 Лист ожидания на следующую тушу!"
      : "🔥 Новая бронь говядины!",
    "",
    `👤 Имя: ${order.name}`,
    `📞 Телефон: ${order.phone}`,
    `🏡 Село: ${order.locality}`,
    `🥩 Часть: ${order.partLabel}`,
    `📦 Объем: ${order.quarterCount} четв.`,
    `🥩 Туша №${order.poolNumber}`,
  ].join("\n");

  const url = new URL("https://platform-api2.max.ru/messages");
  if (userId) {
    url.searchParams.set("user_id", userId);
  } else if (chatId) {
    url.searchParams.set("chat_id", chatId);
  }

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
