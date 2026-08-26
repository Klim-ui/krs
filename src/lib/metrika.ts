const rawId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() ?? "111980588";

export const METRIKA_ID = /^\d+$/.test(rawId) ? Number(rawId) : null;

export function trackBooking(waitlist: boolean) {
  if (!METRIKA_ID || typeof window === "undefined" || !window.ym) return;
  window.ym(METRIKA_ID, "reachGoal", waitlist ? "waitlist" : "booking");
}

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}
