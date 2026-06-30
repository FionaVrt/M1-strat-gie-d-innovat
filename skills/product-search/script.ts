import { PrismaClient } from "@prisma/client";

// Singleton — instancié une seule fois par process, pas au chargement du module
let _prisma: PrismaClient | undefined;
function getPrisma(): PrismaClient {
  if (!_prisma) _prisma = new PrismaClient();
  return _prisma;
}

export const VALID_CATEGORIES = ["Papeterie", "Déco", "Art de la table"] as const;
export type Category = (typeof VALID_CATEGORIES)[number];

export type SearchParams = {
  search?: string;
  category?: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
};

type Success = { ok: true; products: Product[] };
type Failure = { ok: false; error: string };

export async function searchProducts(
  params: SearchParams
): Promise<Success | Failure> {
  const { search, category } = params;

  // Gate déterministe — aucun accès à la base avant ce point
  if (search !== undefined) {
    if (search.length === 0 || search.length > 100) {
      return {
        ok: false,
        error: "Le paramètre 'search' doit contenir entre 1 et 100 caractères.",
      };
    }
  }

  if (category !== undefined) {
    if (!(VALID_CATEGORIES as readonly string[]).includes(category)) {
      return {
        ok: false,
        error: `Catégorie invalide. Valeurs acceptées : ${VALID_CATEGORIES.join(", ")}.`,
      };
    }
  }

  const prisma = getPrisma();

  const products = await prisma.product.findMany({
    where: {
      ...(search && { name: { contains: search } }),
      ...(category && { category }),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      category: true,
      imageUrl: true,
    },
  });

  return { ok: true, products };
}

// Exécution standalone — détection compatible Node.js et bundlers
function isStandaloneRun(): boolean {
  try {
    // import.meta.filename est Node.js 21.2+ seulement ; peut être absent en contexte bundlé
    const selfFile = (import.meta as Record<string, unknown>).filename as string | undefined;
    return typeof selfFile === "string" && process.argv[1] === selfFile;
  } catch {
    return false;
  }
}

if (isStandaloneRun()) {
  const [, , searchArg, categoryArg] = process.argv;
  const params: SearchParams = {};
  if (searchArg && searchArg !== "") params.search = searchArg;
  if (categoryArg && categoryArg !== "") params.category = categoryArg;

  console.log("Paramètres :", params);

  const prisma = getPrisma();
  searchProducts(params)
    .then((result) => {
      if (!result.ok) {
        console.error("Erreur de validation :", result.error);
        process.exit(1);
      }
      console.log(`${result.products.length} produit(s) trouvé(s) :`);
      result.products.forEach((p) =>
        console.log(`  [${p.category}] ${p.name} — ${p.price.toFixed(2)} €`)
      );
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
