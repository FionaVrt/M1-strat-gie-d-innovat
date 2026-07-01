import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "user-demo@maison-papier.fr" },
    update: {},
    create: {
      email: "user-demo@maison-papier.fr",
      name: "Visiteur",
      role: "USER",
    },
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Carnet couverture lin naturel A5",
        description: "Carnet 120 pages papier ivoire 90g, couverture rigide en lin naturel.",
        price: 14.9,
        stock: 42,
        category: "Papeterie",
        imageUrl: "/products/carnet.png",
      },
      {
        name: "Carnet pointillé couverture ardoise B5",
        description: "Format B5, 160 pages papier blanc 80g, idéal pour bullet journal.",
        price: 18.5,
        stock: 30,
        category: "Papeterie",
        imageUrl: "/products/carnet-b5.png",
      },
      {
        name: "Set de 3 carnets Kraft A6",
        description: "Trois petits carnets format poche, couverture kraft recyclé.",
        price: 11.9,
        stock: 55,
        category: "Papeterie",
        imageUrl: "/products/carnet-karfet.png",
      },
      {
        name: "Stylo laiton brossé",
        description: "Stylo bille rechargeable, corps en laiton brossé, écriture fluide.",
        price: 22.0,
        stock: 20,
        category: "Papeterie",
        imageUrl: "/products/stylo.png",
      },
      {
        name: "Vase en grès blanc mat H20",
        description: "Vase cylindrique tourné à la main, grès émaillé blanc mat, hauteur 20 cm.",
        price: 38.0,
        stock: 15,
        category: "Déco",
        imageUrl: "/products/vase-1.png",
      },
      {
        name: "Vase en grès sable nervuré H14",
        description: "Petit vase nervuré, grès naturel couleur sable, hauteur 14 cm.",
        price: 26.5,
        stock: 22,
        category: "Déco",
        imageUrl: "/products/vase-2.png",
      },
      {
        name: "Bougie soja cire végétale — Cèdre & Lin",
        description: "Bougie coulée à la main, cire de soja 100 % végétale, 40 h de combustion.",
        price: 19.9,
        stock: 60,
        category: "Déco",
        imageUrl: "/products/bougie-2.png",
      },
      {
        name: "Bougie soja cire végétale — Bois flotté & Sel marin",
        description: "Même gamme que Cèdre & Lin, parfum littoral doux et iodé.",
        price: 19.9,
        stock: 48,
        category: "Déco",
        imageUrl: "/products/bougie-1.png",
      },
      {
        name: "Set de table en lin lavé — Naturel (lot de 2)",
        description: "Sets de table 35 × 45 cm, lin lavé froissé, coloris naturel non blanchi.",
        price: 24.0,
        stock: 35,
        category: "Art de la table",
        imageUrl: "/products/Set%20de%20table%20en%20lin%20lav%C3%A9%20%E2%80%94%20Naturel.png",
      },
      {
        name: "Set de table en lin lavé — Ardoise (lot de 2)",
        description: "Même modèle que Naturel, coloris ardoise pour une table élégante.",
        price: 24.0,
        stock: 28,
        category: "Art de la table",
        imageUrl: "/products/Set%20de%20table%20en%20lin%20lav%C3%A9%20%E2%80%94%20Ardoise.png",
      },
    ],
  });

  console.log("✓ Seed terminé — utilisateur demo + 10 produits insérés.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
