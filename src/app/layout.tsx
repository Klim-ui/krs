import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krs-tavr.ru"),
  title: "Мясной Пул Таврическое — четверть туши без предоплаты",
  description:
    "Молодые тёлки-герефорды 1,5 года. Четверть туши 530–570 ₽/кг. Без предоплаты: оплата после взвешивания. Доставка до крыльца по Таврическому району и Омску.",
  openGraph: {
    title: "Четверть туши от фермера. Без предоплаты.",
    description:
      "Тёлки-герефорды на зерне. Забой после набора пула. Взвешивание при вас. Доставка до крыльца.",
    locale: "ru_RU",
    type: "website",
    url: "/",
    images: [
      { url: "/heifer.jpg", alt: "Тёлка-герефорд 1,5 года с подворья в Таврическом" },
    ],
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
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
