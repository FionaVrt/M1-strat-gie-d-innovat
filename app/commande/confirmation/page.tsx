import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center gap-8">
      <div className="w-12 h-12 border border-kraft flex items-center justify-center">
        <span className="font-mono text-xl text-kraft">✓</span>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Confirmation</p>
        <h1 className="font-display text-3xl italic text-ink">Commande confirmée</h1>
      </div>

      {id && (
        <p className="font-mono text-xs text-stone">
          Numéro de commande :{" "}
          <span className="text-ink">#{id}</span>
        </p>
      )}

      <p className="text-sm text-stone leading-relaxed max-w-xs">
        Merci pour votre commande. Elle sera préparée avec soin et expédiée prochainement.
      </p>

      <Link
        href="/produits"
        className="border border-ink text-ink font-mono text-xs uppercase tracking-widest px-8 py-3 hover:bg-ink hover:text-linen transition-colors"
      >
        Retour au catalogue
      </Link>
    </main>
  );
}
