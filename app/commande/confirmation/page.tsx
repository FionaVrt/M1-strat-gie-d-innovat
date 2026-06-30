import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center gap-6">
      <div className="text-5xl">✓</div>
      <h1 className="text-2xl font-semibold text-zinc-900">Commande confirmée</h1>
      {id && (
        <p className="text-sm text-zinc-500">
          Numéro de commande : <span className="font-medium text-zinc-900">#{id}</span>
        </p>
      )}
      <p className="text-sm text-zinc-500 max-w-sm">
        Merci pour votre commande. Elle sera préparée avec soin et expédiée prochainement.
      </p>
      <Link
        href="/produits"
        className="rounded-full bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        Retour au catalogue
      </Link>
    </main>
  );
}
