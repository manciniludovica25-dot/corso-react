import type { Metadata } from "next";
import { VT323, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PixelGear",
  description: "Il tuo negozio di accessori per videogiochi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${vt323.variable} ${inter.variable} min-h-screen flex flex-col antialiased`}
      >
        <Navbar />

        <main className="flex-grow">{children}</main>

        <footer className="w-full py-6 px-4 border-t border-neutral-800 text-center text-xs md:text-sm font-sans">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-neutral-500">
            <span className="text-neutral-200">
              © 2026 Ludovica Mancini – PixelGear – Progetto didattico
            </span>

            <span className="text-neutral-600 hidden md:inline">•</span>

            <span>
              <strong className="font-semibold text-neutral-400">
                Disclaimer:
              </strong>{" "}
              sito realizzato a scopo didattico. Le immagini appartengono ai
              rispettivi autori.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
