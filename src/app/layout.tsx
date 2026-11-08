import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krs-tavr.ru"),
  title: "Мясной Пул Таврическое — говядина четвертями и наборами 10 кг без предоплаты",
  description:
    "Свои тёлки герефорд и симментал, 1,5 года, Таврическое. Задняя четверть 600 ₽/кг, передняя 550 ₽/кг, набор 10 кг разделанного мяса 700 ₽/кг. Наборы — бесплатная доставка по Омску. Без предоплаты, оплата по весу.",
  openGraph: {
    title: "Говядина четвертями и наборами 10 кг из Таврического. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Зад 600 ₽/кг, перед 550 ₽/кг, набор 10 кг — 700 ₽/кг. Наборы везём по Омску бесплатно. Без предоплаты.",
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
    title: "Говядина четвертями и наборами 10 кг из Таврического. Без предоплаты.",
    description:
      "Свои тёлки на сене, ячмене и овсе. Зад 600 ₽/кг, перед 550 ₽/кг, набор 10 кг — 700 ₽/кг. Наборы везём по Омску бесплатно. Без предоплаты.",
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
        <Script
          defer
          src="https://umami-production-53ab.up.railway.app/script.js"
          data-website-id="7fbf57a0-37ec-4371-b51e-e7faf1d7beda"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
