"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function NavCart() {
  const { count } = useCart();
  return (
    <Link
      href="/panier"
      className="font-mono text-xs uppercase tracking-widest text-stone hover:text-ink transition-colors flex items-center gap-2"
    >
      Panier
      {count > 0 && (
        <span className="inline-flex items-center justify-center rounded-sm bg-clay text-paper text-[10px] font-mono w-4 h-4 leading-none">
          {count}
        </span>
      )}
    </Link>
  );
}
