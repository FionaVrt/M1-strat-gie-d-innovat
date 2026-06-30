"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function passerCommande() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Erreur lors de la commande.");
        return;
      }
      clearCart();
      router.push(`/commande/confirmation?id=${data.orderId}`);
    } catch {
      setError("Erreur réseau inattendue.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Panier</h1>
        <p className="text-sm text-zinc-400">Votre panier est vide.</p>
        <Link
          href="/produits"
          className="mt-6 inline-block text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-8">Panier</h1>

      <div className="flex flex-col gap-4 mb-10">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{item.name}</p>
              <p className="text-sm text-zinc-500">{item.price.toFixed(2)} € / unité</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 flex items-center justify-center text-base leading-none"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-zinc-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 flex items-center justify-center text-base leading-none"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right text-sm font-semibold text-zinc-900">
              {(item.price * item.quantity).toFixed(2)} €
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-zinc-300 hover:text-red-400 transition-colors text-lg leading-none"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-200 pt-6">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Total estimé</p>
          <p className="text-2xl font-semibold text-zinc-900">{total.toFixed(2)} €</p>
          <p className="text-xs text-zinc-400 mt-0.5">Le total définitif est calculé côté serveur.</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={passerCommande}
            disabled={loading}
            className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {loading ? "En cours…" : "Passer commande"}
          </button>
        </div>
      </div>
    </main>
  );
}
