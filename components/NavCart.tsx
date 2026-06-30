"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function NavCart() {
  const { count } = useCart();
  return (
    <Link
      href="/panier"
      className="relative text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
    >
      Panier
      {count > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-zinc-900 text-white text-xs w-5 h-5">
          {count}
        </span>
      )}
    </Link>
  );
}
