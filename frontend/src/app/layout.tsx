import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "КЛЯКСА — тату-студия в Москве",
  description: "Тату, пирсинг и обучение в центре Москвы. Индивидуальные эскизы, премиальное оборудование, бесплатная консультация.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
