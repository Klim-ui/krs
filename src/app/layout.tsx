import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мясной Пул Таврическое — фермерская говядина",
  description:
    "Домашняя говядина герефорд в семейных наборах с доставкой по Таврическому району и в Омск.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
