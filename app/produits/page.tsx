"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
};

const CATEGORIES = ["Papeterie", "Déco", "Art de la table"];

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);

    setLoading(true);
    setError(null);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d.error));
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message =
          typeof err === "string"
            ? err
            : err instanceof Error
            ? err.message
            : "Erreur inattendue.";
        setError(message);
        setLoading(false);
      });
  }, [search, category]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone mb-2">
          Collection
        </p>
        <h1 className="font-display text-3xl italic text-ink">Catalogue</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="search"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-stone/30 bg-paper px-4 py-2 text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-kraft transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-stone/30 bg-paper px-4 py-2 text-sm text-ink focus:outline-none focus:border-kraft transition-colors"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-clay mb-6">{error}</p>
      )}

      {loading ? (
        <p className="font-mono text-xs uppercase tracking-widest text-stone">Chargement…</p>
      ) : products.length === 0 ? (
        <p className="font-mono text-xs uppercase tracking-widest text-stone">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone/15">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
