import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "B2B Üretim ve Tedarik Platformu",
    template: "%s | B2B Üretim Platformu",
  },
  description:
    "Üretici firmalar ile kurumsal firmaları tek platformda buluşturuyoruz. İhtiyacınızı yayınlayın, doğrulanmış üreticilerden teklifler alın.",
  keywords: ["B2B", "üretim", "tedarik", "ihale", "üretici", "kurumsal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${plusJakarta.className} ${display.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
