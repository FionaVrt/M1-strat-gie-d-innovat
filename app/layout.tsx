import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import NavCart from "@/components/NavCart";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison Papier",
  description: "Papeterie et décoration minimaliste d'inspiration scandinave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-linen text-ink antialiased">
        <CartProvider>
          <header className="border-b border-[0.5px] border-stone/20 bg-linen">
            <div className="mx-auto max-w-5xl px-8 h-16 flex items-center justify-between">
              <a
                href="/"
                className="font-display text-lg text-ink italic tracking-wide"
              >
                Maison Papier
              </a>
              <nav className="flex items-center gap-10">
                <a
                  href="/produits"
                  className="font-mono text-[11px] uppercase tracking-widest text-stone hover:text-ink transition-colors duration-150"
                >
                  Catalogue
                </a>
                <NavCart />
              </nav>
            </div>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
