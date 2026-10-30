import { Phone } from "lucide-react";

export function StickyBookBar({ phoneHref }: { phoneHref?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-black/10 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      {phoneHref ? (
        <a
          href={phoneHref}
          aria-label="Позвонить фермеру"
          className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#47733d] px-4 font-semibold text-[#47733d]"
        >
          <Phone className="size-5" />
          Позвонить
        </a>
      ) : null}
      <a
        href="#order"
        className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#9f2f24] px-3 text-center font-semibold text-white"
      >
        {phoneHref ? "Забронировать" : "Забронировать без предоплаты"}
      </a>
    </div>
  );
}
