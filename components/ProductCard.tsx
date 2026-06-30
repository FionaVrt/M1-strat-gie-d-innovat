"use client";

import { useCart } from "@/lib/cart-context";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="h-48 bg-zinc-100 flex items-center justify-center text-zinc-300 text-sm">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>Image à venir</span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4 flex-1">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {product.category}
        </span>
        <h2 className="text-sm font-semibold text-zinc-900 leading-snug">
          {product.name}
        </h2>
        {product.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-zinc-900">
            {product.price.toFixed(2)} €
          </p>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
