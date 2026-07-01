import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-8 bg-linen">
      <div className="max-w-lg text-center space-y-10">
        <div className="space-y-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone">
            Papeterie &amp; Décoration
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-ink italic leading-[1.1]">
            Des objets faits pour durer.
          </h1>
        </div>
        <p className="text-sm text-stone leading-relaxed max-w-xs mx-auto">
          Une sélection minimaliste d’inspiration scandinave,
          pensée pour le quotidien.
        </p>
        <Link
          href="/produits"
          className="inline-block border border-ink text-ink font-mono text-[11px] uppercase tracking-widest px-10 py-3.5 hover:bg-ink hover:text-linen transition-colors duration-150 rounded-[2px]"
        >
          Voir le catalogue
        </Link>
      </div>
    </main>
  );
}
