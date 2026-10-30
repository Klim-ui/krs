// Контакты фермера задаются переменными окружения в Railway,
// чтобы менять номер без правки кода. Пустые значения — кнопки не показываются.

export type Contacts = {
  phoneDisplay: string;
  phoneHref: string;
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
  if (!phone) return null;

  const messengerUrl = process.env.FARMER_MESSENGER_URL?.trim();
  const whatsapp = process.env.FARMER_WHATSAPP?.trim() === "1";

  return {
    phoneDisplay: formatPhone(phone),
    phoneHref: `tel:+${phone}`,
    messengerHref: messengerUrl || (whatsapp ? `https://wa.me/${phone}` : null),
    messengerLabel:
      process.env.FARMER_MESSENGER_LABEL?.trim() ||
      (messengerUrl ? "Написать в MAX" : "Написать в WhatsApp"),
  };
}
