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
      ? order.partLabel
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
) {
  const url = new URL("https://platform-api2.max.ru/messages");
  for (const [key, value] of Object.entries(target)) {
    url.searchParams.set(key, value);
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

  const details = await response.text().catch(() => "");
  if (!response.ok) {
    throw new Error(
      `MAX API ${JSON.stringify(target)} ${response.status}${details ? `: ${details}` : ""}`,
    );
  }
}

type MaxUpdate = {
  update_type?: string;
  chat_id?: number | string;
  user?: { user_id?: number | string };
};

export async function findMaxDialogs() {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  if (!token) throw new Error("MAX_BOT_TOKEN не задан");

  const response = await fetch(
    "https://platform-api2.max.ru/updates?types=bot_started,message_created",
    {
      headers: { Authorization: token },
      signal: AbortSignal.timeout(8_000),
    },
  );
  const details = await response.text();
  if (!response.ok) {
    throw new Error(`MAX updates ${response.status}: ${details}`);
  }

  const payload = JSON.parse(details) as { updates?: MaxUpdate[] };
  const chatIds = new Set<string>();
  const userIds = new Set<string>();

  for (const update of payload.updates ?? []) {
    if (update.chat_id != null) chatIds.add(String(update.chat_id));
    if (update.user?.user_id != null) userIds.add(String(update.user.user_id));
  }

  return {
    chatIds: [...chatIds],
    userIds: [...userIds],
    updateCount: payload.updates?.length ?? 0,
  };
}

export async function sendReservationNotification(order: ReservationMessage) {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  const chatId = process.env.MAX_CHAT_ID?.trim();
  const userId = process.env.MAX_USER_ID?.trim();

  if (!token) {
    console.error("MAX notification skipped: MAX_BOT_TOKEN is empty");
    return;
  }

  const recipients: Array<Record<string, string>> = [];
  if (chatId) recipients.push({ chat_id: chatId });
  if (userId) recipients.push({ user_id: userId });
  if (chatId && chatId !== userId) recipients.push({ user_id: chatId });

  if (recipients.length === 0) {
    console.error("MAX notification skipped: no MAX_CHAT_ID or MAX_USER_ID");
    return;
  }

  const text = buildMessage(order);
  const errors: string[] = [];

  for (const target of recipients) {
    try {
      await sendMaxMessage(token, text, target);
      console.info("MAX notification sent", target);
      return;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(errors.join(" | "));
}
