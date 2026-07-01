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
      <main className="mx-auto max-w-5xl px-8 py-20">
        <div className="mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone mb-3">Sélection</p>
          <h1 className="font-display text-4xl italic text-ink">Panier</h1>
        </div>
        <p className="text-sm text-stone">Votre panier est vide.</p>
        <Link
          href="/produits"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-widest text-stone hover:text-ink underline underline-offset-4 transition-colors"
        >
          Retour au catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-20">
      <div className="mb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone mb-3">Sélection</p>
        <h1 className="font-display text-4xl italic text-ink">Panier</h1>
      </div>

      <div className="flex flex-col divide-y divide-stone/10 mb-14 border-[0.5px] border-stone/20">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-5 bg-paper px-5 py-5">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-16 object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display text-[15px] italic text-ink truncate">{item.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone mt-1">
                {item.price.toFixed(2)} € / unité
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 border-[0.5px] border-stone/30 text-stone hover:border-ink hover:text-ink flex items-center justify-center text-base leading-none transition-colors rounded-[2px]"
              >
                −
              </button>
              <span className="w-7 text-center font-mono text-sm text-ink">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-7 h-7 border-[0.5px] border-stone/30 text-stone hover:border-ink hover:text-ink flex items-center justify-center text-base leading-none transition-colors rounded-[2px]"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-mono text-sm text-ink">
              {(item.price * item.quantity).toFixed(2)} €
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="font-mono text-xs text-stone/30 hover:text-clay transition-colors"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-[0.5px] border-stone/20">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone mb-2">Total estimé</p>
          <p className="font-mono text-3xl text-ink">{total.toFixed(2)} €</p>
          <p className="text-xs text-stone/50 mt-1.5">Le total définitif est calculé côté serveur.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {error && <p className="text-sm text-clay max-w-xs text-right">{error}</p>}
          <button
            onClick={passerCommande}
            disabled={loading}
            className="border border-ink text-ink font-mono text-[11px] uppercase tracking-widest px-12 py-3.5 hover:bg-ink hover:text-linen transition-colors duration-150 disabled:opacity-40 rounded-[2px]"
          >
            {loading ? "En cours…" : "Passer commande"}
          </button>
        </div>
      </div>
    </main>
  );
}
