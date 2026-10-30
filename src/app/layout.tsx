import type { Metadata, Viewport } from "next";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krs-tavr.ru"),
  title: "Мясной Пул Таврическое — задняя четверть и наборы переда без предоплаты",
  description:
    "Свои тёлки герефорд и симментал, 1,5 года, Тавричанка. Задняя четверть целиком 570 ₽/кг. Набор из переда 10–15 кг — 530 ₽/кг. Без предоплаты, весы у крыльца.",
  openGraph: {
    title: "Зад целиком. Перед — наборами. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Забой после набора броней. Взвешивание при вас. Доставка до крыльца.",
    locale: "ru_RU",
    type: "website",
    url: "/",
    images: [
      {
        url: "/photos/heifers-now.webp",
        alt: "Три тёлки в загоне, Тавричанка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Зад целиком. Перед — наборами. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Забой после набора броней. Взвешивание при вас. Доставка до крыльца.",
    images: ["/photos/heifers-now.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#47733d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col antialiased">
        <YandexMetrika />
        {children}
      </body>
    </html>
  );
}
