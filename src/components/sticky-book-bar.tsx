import { MessageCircle, Phone } from "lucide-react";

export function StickyBookBar({
  phoneHref,
  messengerHref,
}: {
  phoneHref?: string;
  messengerHref?: string;
}) {
  const contactHref = phoneHref ?? messengerHref;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-black/10 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      {contactHref ? (
        <a
          href={contactHref}
          {...(phoneHref ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          aria-label={phoneHref ? "Позвонить фермеру" : "Написать фермеру"}
          className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#47733d] px-4 font-semibold text-[#47733d]"
        >
          {phoneHref ? (
            <Phone className="size-5" />
          ) : (
            <MessageCircle className="size-5" />
          )}
          {phoneHref ? "Позвонить" : "Написать"}
        </a>
      ) : null}
      <a
        href="#order"
        className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#9f2f24] px-3 text-center font-semibold text-white"
      >
        {contactHref ? "Забронировать" : "Забронировать без предоплаты"}
      </a>
    </div>
  );
}
