import { MessageCircle, Phone } from "lucide-react";
import type { Contacts } from "@/lib/contacts";

const questions = [
  {
    q: "Мясо свежее?",
    a: "Да. Не держим мясо на складе: забиваем, когда на тушу наберутся все брони, и сразу зовём забирать.",
  },
  {
    q: "Где и как забирать?",
    a: "Приезжаете сами в Таврическое. Адрес и время скажу, когда позвоню подтвердить бронь. Доставки нет.",
  },
  {
    q: "А если вес выйдет больше или меньше?",
    a: "Платите только за то, что показали весы при вас. Четверть обычно ~45–55 кг, в брони считаем ~50 кг.",
  },
  {
    q: "Четверть режете на куски?",
    a: "Нет, отдаём четверть целиком, на кости — как после разруба туши. Делите дома под свою семью.",
  },
  {
    q: "Нужно платить заранее?",
    a: "Нет. Бронь бесплатная, никаких переводов. Деньги — на месте, после взвешивания.",
  },
  {
    q: "Передумал — можно отменить бронь?",
    a: "Можно. Скажите, когда фермер позвонит подтвердить бронь, или напишите сами.",
  },
  {
    q: "Куда девать 50 кг?",
    a: "Нужен морозильный ларь или две морозилки. Многие берут одну четверть на две семьи — с роднёй или соседями.",
  },
  {
    q: "Когда забой?",
    a: "Когда на тушу наберутся все брони. Позвоню заранее и договоримся, в какой день приезжать.",
  },
];

export function FaqSection({ contacts }: { contacts: Contacts }) {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f2f24]">
          Частые вопросы
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Что спрашивают перед бронью
        </h2>
        <div className="mt-8 divide-y divide-[#e5dccf] rounded-2xl border border-[#e5dccf]">
          {questions.map((item) => (
            <details key={item.q} className="group px-5 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-xl font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="shrink-0 text-2xl text-[#9f2f24] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 text-lg leading-8 text-[#635b50]">{item.a}</p>
            </details>
          ))}
        </div>

        {contacts ? (
          <div className="mt-8 rounded-2xl bg-[#f4eee3] p-6">
            <p className="font-serif text-2xl font-semibold">
              {contacts.phoneHref
                ? "Остались вопросы — позвоните фермеру"
                : "Остались вопросы — напишите фермеру"}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {contacts.phoneHref ? (
                <a
                  href={contacts.phoneHref}
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#47733d] px-6 text-lg font-semibold text-white"
                >
                  <Phone className="size-5" />
                  Позвонить
                </a>
              ) : null}
              {contacts.messengerHref ? (
                <a
                  href={contacts.messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#47733d] px-6 text-lg font-semibold text-[#47733d]"
                >
                  <MessageCircle className="size-5" />
                  {contacts.messengerLabel}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
