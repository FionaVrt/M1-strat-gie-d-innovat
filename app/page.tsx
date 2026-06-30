import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-zinc-50">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Maison Papier
        </h1>
        <p className="text-base text-zinc-500 leading-relaxed">
          Papeterie et décoration minimaliste d&apos;inspiration scandinave.
          Des objets simples, durables, pensés pour le quotidien.
        </p>
        <Link
          href="/produits"
          className="inline-block rounded-full bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Voir le catalogue
        </Link>
      </div>
    </main>
  );
}
