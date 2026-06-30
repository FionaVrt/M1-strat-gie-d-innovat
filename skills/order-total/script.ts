import { PrismaClient } from "@prisma/client";

export type OrderItem = {
  productId: number;
  quantity: number;
};

export type OrderLine = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

type Success = { ok: true; total: number; lines: OrderLine[] };
type Failure = { ok: false; error: string };

export async function calculerTotalCommande(
  prisma: PrismaClient,
  items: OrderItem[]
): Promise<Success | Failure> {
  if (items.length === 0) {
    return { ok: false, error: "La commande doit contenir au moins un article." };
  }

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return {
        ok: false,
        error: `La quantité pour le produit ${item.productId} doit être un entier strictement positif.`,
      };
    }
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines: OrderLine[] = [];
  let total = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return {
        ok: false,
        error: `Produit introuvable : id ${item.productId}.`,
      };
    }
    if (item.quantity > product.stock) {
      return {
        ok: false,
        error: `Stock insuffisant pour « ${product.name} » — demandé : ${item.quantity}, disponible : ${product.stock}.`,
      };
    }
    lines.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price });
    total += product.price * item.quantity;
  }

  return { ok: true, total: Math.round(total * 100) / 100, lines };
}

// Exécution standalone
function isStandaloneRun(): boolean {
  try {
    const selfFile = (import.meta as Record<string, unknown>).filename as string | undefined;
    return typeof selfFile === "string" && process.argv[1] === selfFile;
  } catch {
    return false;
  }
}

if (isStandaloneRun()) {
  const args = process.argv.slice(2);
  const items: OrderItem[] =
    args.length === 0
      ? [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }]
      : args.map((arg) => {
          const [id, qty] = arg.split(":").map(Number);
          return { productId: id, quantity: qty };
        });

  console.log("Items :", items);

  const prisma = new PrismaClient();
  calculerTotalCommande(prisma, items)
    .then((result) => {
      if (!result.ok) {
        console.error("Erreur de validation :", result.error);
        process.exit(1);
      }
      console.log(`Total : ${result.total.toFixed(2)} €`);
      result.lines.forEach((l) =>
        console.log(`  produit ${l.productId} × ${l.quantity} à ${l.unitPrice.toFixed(2)} €`)
      );
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
