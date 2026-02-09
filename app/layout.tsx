import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SixOne Piano Lab - Aprende piano con teclado",
  description: "Simulador de piano con teclado QWERTY. Lecciones progresivas para aprender con ambas manos como en un piano real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen font-sans bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
