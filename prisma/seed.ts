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
        imageUrl: "https://picsum.photos/seed/carnet-lin/400/300",
      },
      {
        name: "Carnet pointillé couverture ardoise B5",
        description: "Format B5, 160 pages papier blanc 80g, idéal pour bullet journal.",
        price: 18.5,
        stock: 30,
        category: "Papeterie",
        imageUrl: "https://picsum.photos/seed/carnet-ardoise/400/300",
      },
      {
        name: "Set de 3 carnets Kraft A6",
        description: "Trois petits carnets format poche, couverture kraft recyclé.",
        price: 11.9,
        stock: 55,
        category: "Papeterie",
        imageUrl: "https://picsum.photos/seed/carnets-kraft/400/300",
      },
      {
        name: "Stylo laiton brossé",
        description: "Stylo bille rechargeable, corps en laiton brossé, écriture fluide.",
        price: 22.0,
        stock: 20,
        category: "Papeterie",
        imageUrl: "https://picsum.photos/seed/stylo-laiton/400/300",
      },
      // Déco
      {
        name: "Vase en grès blanc mat H20",
        description: "Vase cylindrique tourné à la main, grès émaillé blanc mat, hauteur 20 cm.",
        price: 38.0,
        stock: 15,
        category: "Déco",
        imageUrl: "https://picsum.photos/seed/vase-blanc/400/300",
      },
      {
        name: "Vase en grès sable nervué H14",
        description: "Petit vase nervué, grès naturel couleur sable, hauteur 14 cm.",
        price: 26.5,
        stock: 22,
        category: "Déco",
        imageUrl: "https://picsum.photos/seed/vase-sable/400/300",
      },
      {
        name: "Bougie soja cire végétale — Cèdre & Lin",
        description: "Bougie coulée à la main, cire de soja 100 % végétale, 40 h de combustion.",
        price: 19.9,
        stock: 60,
        category: "Déco",
        imageUrl: "https://picsum.photos/seed/bougie-cedre/400/300",
      },
      {
        name: "Bougie soja cire végétale — Bois flotté & Sel marin",
        description: "Même gamme que Cèdre & Lin, parfum littoral doux et iodé.",
        price: 19.9,
        stock: 48,
        category: "Déco",
        imageUrl: "https://picsum.photos/seed/bougie-bois/400/300",
      },
      // Art de la table
      {
        name: "Set de table en lin lavé — Naturel (lot de 2)",
        description: "Sets de table 35 × 45 cm, lin lavé froisé, coloris naturel non blanchi.",
        price: 24.0,
        stock: 35,
        category: "Art de la table",
        imageUrl: "https://picsum.photos/seed/set-table-naturel/400/300",
      },
      {
        name: "Set de table en lin lavé — Ardoise (lot de 2)",
        description: "Même modèle que Naturel, coloris ardoise pour une table élégante.",
        price: 24.0,
        stock: 28,
        category: "Art de la table",
        imageUrl: "https://picsum.photos/seed/set-table-ardoise/400/300",
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
