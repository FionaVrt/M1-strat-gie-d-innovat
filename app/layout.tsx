import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import NavCart from "@/components/NavCart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
              <a href="/" className="text-sm font-semibold text-zinc-900 tracking-wide">
                Maison Papier
              </a>
              <nav className="flex items-center gap-6">
                <a href="/produits" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
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
