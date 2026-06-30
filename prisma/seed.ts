import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      // Papeterie
      {
        name: "Carnet couverture lin naturel A5",
        description: "Carnet 120 pages papier ivoire 90g, couverture rigide en lin naturel.",
        price: 14.9,
        stock: 42,
        category: "Papeterie",
      },
      {
        name: "Carnet pointillé couverture ardoise B5",
        description: "Format B5, 160 pages papier blanc 80g, idéal pour bullet journal.",
        price: 18.5,
        stock: 30,
        category: "Papeterie",
      },
      {
        name: "Set de 3 carnets Kraft A6",
        description: "Trois petits carnets format poche, couverture kraft recyclé.",
        price: 11.9,
        stock: 55,
        category: "Papeterie",
      },
      {
        name: "Stylo laiton brossé",
        description: "Stylo bille rechargeable, corps en laiton brossé, écriture fluide.",
        price: 22.0,
        stock: 20,
        category: "Papeterie",
      },
      // Déco
      {
        name: "Vase en grès blanc mat H20",
        description: "Vase cylindrique tourné à la main, grès émaillé blanc mat, hauteur 20 cm.",
        price: 38.0,
        stock: 15,
        category: "Déco",
      },
      {
        name: "Vase en grès sable nervuré H14",
        description: "Petit vase nervuré, grès naturel couleur sable, hauteur 14 cm.",
        price: 26.5,
        stock: 22,
        category: "Déco",
      },
      {
        name: "Bougie soja cire végétale — Cèdre & Lin",
        description: "Bougie coulée à la main, cire de soja 100 % végétale, 40 h de combustion.",
        price: 19.9,
        stock: 60,
        category: "Déco",
      },
      {
        name: "Bougie soja cire végétale — Bois flotté & Sel marin",
        description: "Même gamme que Cèdre & Lin, parfum littoral doux et iodé.",
        price: 19.9,
        stock: 48,
        category: "Déco",
      },
      // Art de la table
      {
        name: "Set de table en lin lavé — Naturel (lot de 2)",
        description: "Sets de table 35 × 45 cm, lin lavé froissé, coloris naturel non blanchi.",
        price: 24.0,
        stock: 35,
        category: "Art de la table",
      },
      {
        name: "Set de table en lin lavé — Ardoise (lot de 2)",
        description: "Même modèle que Naturel, coloris ardoise pour une table élégante.",
        price: 24.0,
        stock: 28,
        category: "Art de la table",
      },
    ],
  });

  console.log("✓ Seed terminé — 10 produits insérés.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
