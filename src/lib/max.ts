type ReservationMessage = {
  name: string;
  phone: string;
  locality: string;
  quarterCount: number;
  partLabel: string;
};

function buildMessage(order: ReservationMessage) {
  const quarters =
    order.quarterCount === 1
      ? `${order.partLabel} четверть`
      : `${order.quarterCount} × ${order.partLabel.toLowerCase()}`;

  return [
    "Новая заявка",
    "",
    order.name,
    order.phone,
    order.locality,
    quarters,
  ].join("\n");
}

async function sendMaxMessage(token: string, text: string, target: URLSearchParams) {
  const url = new URL("https://platform-api2.max.ru/messages");
  target.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token.trim(),
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

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  const chatId = process.env.MAX_CHAT_ID?.trim();
  const userId = process.env.MAX_USER_ID?.trim();

  if (!token || (!chatId && !userId)) return;

  const text = buildMessage(order);
  const errors: unknown[] = [];

  // Dialog chat_id is the real conversation; user_id is only a fallback.
  if (chatId) {
    try {
      await sendMaxMessage(
        token,
        text,
        new URLSearchParams({ chat_id: chatId }),
      );
      return;
    } catch (error) {
      errors.push(error);
    }
  }

  if (userId) {
    try {
      await sendMaxMessage(
        token,
        text,
        new URLSearchParams({ user_id: userId }),
      );
      return;
    } catch (error) {
      errors.push(error);
    }
  }

  throw errors[0] ?? new Error("MAX recipient is not configured");
}
