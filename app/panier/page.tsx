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
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone mb-2">Sélection</p>
          <h1 className="font-display text-3xl italic text-ink">Panier</h1>
        </div>
        <p className="text-sm text-stone">Votre panier est vide.</p>
        <Link
          href="/produits"
          className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-stone hover:text-ink underline underline-offset-4 transition-colors"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone mb-2">Sélection</p>
        <h1 className="font-display text-3xl italic text-ink">Panier</h1>
      </div>

      <div className="flex flex-col divide-y divide-stone/15 mb-10 border border-stone/20">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-paper px-4 py-4"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-14 w-14 object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm italic text-ink truncate">{item.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone mt-0.5">
                {item.price.toFixed(2)} € / unité
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-6 h-6 border border-stone/30 text-stone hover:border-ink hover:text-ink flex items-center justify-center text-base leading-none transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-sm text-ink">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-6 h-6 border border-stone/30 text-stone hover:border-ink hover:text-ink flex items-center justify-center text-base leading-none transition-colors"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-mono text-sm text-ink">
              {(item.price * item.quantity).toFixed(2)} €
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="font-mono text-xs text-stone/40 hover:text-clay transition-colors"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-stone/20">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone mb-1">Total estimé</p>
          <p className="font-mono text-2xl text-ink">{total.toFixed(2)} €</p>
          <p className="text-xs text-stone/60 mt-1">Le total définitif est calculé côté serveur.</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {error && <p className="text-sm text-clay max-w-xs text-right">{error}</p>}
          <button
            onClick={passerCommande}
            disabled={loading}
            className="border border-ink text-ink font-mono text-xs uppercase tracking-widest px-10 py-3 hover:bg-ink hover:text-linen transition-colors disabled:opacity-40"
          >
            {loading ? "En cours…" : "Passer commande"}
          </button>
        </div>
      </div>
    </main>
  );
}
