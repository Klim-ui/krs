import Link from "next/link";

export const metadata = {
  title: "Персональные данные — Мясной Пул Таврическое",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[#251f18]">
      <Link href="/" className="text-sm font-semibold text-[#47733d]">
        ← На сайт
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-semibold">
        Персональные данные
      </h1>
      <p className="mt-4 leading-7 text-[#635b50]">
        Имя, телефон и населённый пункт нужны только чтобы связаться по брони
        четверти туши. Никому не продаём и не рассылаем рекламу. Заявка
        приходит фермеру в мессенджер MAX.
      </p>
      <p className="mt-3 leading-7 text-[#635b50]">
        На сайте стоит Яндекс Метрика: визиты и Вебвизор (запись экрана), чтобы
        понять, доходят ли люди с ВК и ОК. Не для рекламы.
      </p>
      <p className="mt-3 leading-7 text-[#635b50]">
        Чтобы удалить данные — напишите или позвоните по тому же номеру, с
        которого оставляли заявку.
      </p>
    </main>
  );
}
