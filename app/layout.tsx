import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PC Piano Learner - Simulador de Piano",
  description: "Simulador de piano con teclado QWERTY, lecciones y Tone.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-[#0f0f12]">
        {children}
      </body>
    </html>
  );
}
