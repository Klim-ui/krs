// Контакты фермера задаются переменными окружения в Railway,
// чтобы менять номер без правки кода. Пустые значения — кнопки не показываются.

export type Contacts = {
  phoneDisplay: string | null;
  phoneHref: string | null;
  messengerHref: string | null;
  messengerLabel: string;
} | null;

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && /^[78]/.test(digits)) return `7${digits.slice(1)}`;
  if (digits.length === 10) return `7${digits}`;
  return null;
}

function formatPhone(digits: string) {
  const d = digits.slice(1);
  return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
}

export function getContacts(): Contacts {
  const phone = normalizePhone(process.env.FARMER_PHONE?.trim() ?? "");
  const rawMessengerUrl = process.env.FARMER_MESSENGER_URL?.trim() ?? "";
  const messengerUrl = /^https:\/\//.test(rawMessengerUrl) ? rawMessengerUrl : "";
  const whatsapp = process.env.FARMER_WHATSAPP?.trim() === "1";
  const messengerHref =
    messengerUrl || (whatsapp && phone ? `https://wa.me/${phone}` : null);

  if (!phone && !messengerHref) return null;

  return {
    phoneDisplay: phone ? formatPhone(phone) : null,
    phoneHref: phone ? `tel:+${phone}` : null,
    messengerHref,
    messengerLabel:
      process.env.FARMER_MESSENGER_LABEL?.trim() ||
      (messengerUrl ? "Написать в MAX" : "Написать в WhatsApp"),
  };
}
