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

const DOG_EAR = 20;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div
      className="relative flex flex-col bg-paper border-[0.5px] border-stone/20 overflow-hidden"
      style={{ clipPath: `polygon(0 0, calc(100% - ${DOG_EAR}px) 0, 100% ${DOG_EAR}px, 100% 100%, 0 100%)` }}
    >
      {/* Coin plié */}
      <div
        className="absolute top-0 right-0 z-10 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: `0 ${DOG_EAR}px ${DOG_EAR}px 0`,
          borderColor: `transparent #F2EDE4 transparent transparent`,
        }}
      />

      {/* Image */}
      <div className="h-52 bg-linen flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone/40">
            Image à venir
          </span>
        )}
      </div>

      {/* Corps */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
          {product.category}
        </span>
        <h2 className="font-display text-[17px] italic text-ink leading-snug">
          {product.name}
        </h2>
        {product.description && (
          <p className="text-xs text-stone leading-relaxed line-clamp-2 mt-0.5">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span className="font-mono text-base text-ink">
            {product.price.toFixed(2)} €
          </span>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            className="border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ink hover:text-paper transition-colors duration-150 rounded-[2px]"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
