import type { Metadata, Viewport } from "next";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krs-tavr.ru"),
  title: "Мясной Пул Таврическое — говядина четвертями без предоплаты",
  description:
    "Свои тёлки герефорд и симментал, 1,5 года, Таврическое. Задняя четверть 600 ₽/кг, передняя 550 ₽/кг, целиком на кости. Без предоплаты, самовывоз, вес при вас.",
  openGraph: {
    title: "Говядина четвертями из Таврического. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Зад 600 ₽/кг, перед 550 ₽/кг. Забой после набора броней. Самовывоз, вес при вас.",
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
    title: "Говядина четвертями из Таврического. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Зад 600 ₽/кг, перед 550 ₽/кг. Забой после набора броней. Самовывоз, вес при вас.",
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
