import type { Metadata, Viewport } from "next";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krs-tavr.ru"),
  title: "Мясной Пул Таврическое — задняя четверть и наборы переда без предоплаты",
  description:
    "Тёлки-герефорды 1,5 года. Задняя четверть целиком 570 ₽/кг. Набор из переда 10–15 кг — 530 ₽/кг, честный микс мякоти и рёбер. Без предоплаты, весы у крыльца.",
  openGraph: {
    title: "Зад целиком. Перед — наборами. Без предоплаты.",
    description:
      "Тёлки-герефорды на зерне. Забой после набора пула. Взвешивание при вас. Доставка до крыльца.",
    locale: "ru_RU",
    type: "website",
    url: "/",
    images: [
      {
        url: "/pasture.jpg",
        alt: "Тёлки на выпасе, Таврическое",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Зад целиком. Перед — наборами. Без предоплаты.",
    description:
      "Тёлки-герефорды на зерне. Забой после набора пула. Взвешивание при вас. Доставка до крыльца.",
    images: ["/pasture.jpg"],
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
