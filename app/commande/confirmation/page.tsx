import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-8 py-28 flex flex-col items-center text-center gap-10">
      <div className="w-14 h-14 border-[0.5px] border-kraft flex items-center justify-center rounded-[2px]">
        <span className="font-mono text-xl text-kraft">✓</span>
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone">Confirmation</p>
        <h1 className="font-display text-4xl italic text-ink">Commande confirmée</h1>
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
        className="border border-ink text-ink font-mono text-[11px] uppercase tracking-widest px-10 py-3.5 hover:bg-ink hover:text-linen transition-colors duration-150 rounded-[2px]"
      >
        Retour au catalogue
      </Link>
    </main>
  );
}
