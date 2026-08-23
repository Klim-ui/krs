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

async function sendMaxMessage(
  token: string,
  text: string,
  target: Record<string, string>,
  authorization: string,
) {
  const url = new URL("https://platform-api2.max.ru/messages");
  for (const [key, value] of Object.entries(target)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, notify: true }),
    signal: AbortSignal.timeout(5_000),
  });

  const details = await response.text().catch(() => "");
  if (!response.ok) {
    throw new Error(
      `MAX API ${JSON.stringify(target)} ${response.status}${details ? `: ${details}` : ""}`,
    );
  }
}

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  const chatId = process.env.MAX_CHAT_ID?.trim();
  const userId = process.env.MAX_USER_ID?.trim();

  if (!token) {
    console.error("MAX notification skipped: MAX_BOT_TOKEN is empty");
    return;
  }

  const recipients = [
    chatId ? { chat_id: chatId } : null,
    chatId ? { user_id: chatId } : null,
    userId && userId !== chatId ? { user_id: userId } : null,
  ].filter((item): item is Record<string, string> => item !== null);

  if (recipients.length === 0) {
    console.error("MAX notification skipped: no MAX_CHAT_ID or MAX_USER_ID");
    return;
  }

  const text = buildMessage(order);
  const authorizations = [token, `Bearer ${token}`];
  const errors: string[] = [];

  for (const authorization of authorizations) {
    for (const target of recipients) {
      try {
        await sendMaxMessage(token, text, target, authorization);
        console.info("MAX notification sent", target);
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(message);
      }
    }
  }

  throw new Error(errors.join(" | "));
}
