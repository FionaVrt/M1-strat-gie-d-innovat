import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 bg-linen">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            Papeterie & Décoration
          </p>
          <h1 className="font-display text-5xl text-ink italic leading-tight">
            Maison Papier
          </h1>
        </div>
        <p className="text-sm text-stone leading-relaxed max-w-xs mx-auto">
          Des objets simples, durables, pensés pour le quotidien.
          Une sélection minimaliste d&apos;inspiration scandinave.
        </p>
        <Link
          href="/produits"
          className="inline-block border border-ink text-ink font-mono text-xs uppercase tracking-widest px-8 py-3 hover:bg-ink hover:text-linen transition-colors"
        >
          Voir le catalogue
        </Link>
      </div>
    </main>
  );
}
