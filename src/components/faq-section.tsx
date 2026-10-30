import { MessageCircle, Phone } from "lucide-react";
import type { Contacts } from "@/lib/contacts";

const questions = [
  {
    q: "Мясо не испортится по дороге?",
    a: "Нет. Не держим мясо на складе и не возим сутками: забиваем, когда наберём тушу, и в тот же день везём по Таврическому району и Омску до крыльца.",
  },
  {
    q: "А если вес выйдет больше или меньше?",
    a: "Платите только за то, что показали весы у вас на крыльце. Набор переда бывает 10–15 кг, в брони считаем ~12 кг. Задняя четверть — ~45–55 кг.",
  },
  {
    q: "Не будет одних костей?",
    a: "Набор пилим поперёк четверти, у всех одинаковый микс: 40% мякоти, 30% рёбер и грудинки, 20% антрекота на кости, 10% супового. Всё видно при взвешивании, до оплаты.",
  },
  {
    q: "Нужно платить заранее?",
    a: "Нет. Бронь бесплатная, никаких переводов. Деньги — когда мясо у вас и взвешено при вас.",
  },
  {
    q: "Передумал — можно отменить бронь?",
    a: "Можно. Скажите, когда фермер позвонит подтвердить бронь, или позвоните сами.",
  },
  {
    q: "Влезет ли в морозилку?",
    a: "Набор ~12 кг — в коробке ~40×30 см, это одна полка обычной морозилки. Задняя четверть ~50 кг — нужен ларь, или возьмите на двоих с соседом.",
  },
  {
    q: "Когда привезёте?",
    a: "Забой — когда на тушу наберутся все брони. Фермер позвонит заранее и договорится с вами о дне доставки.",
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
