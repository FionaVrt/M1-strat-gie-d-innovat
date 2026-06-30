import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | undefined;
function getPrisma(): PrismaClient {
  if (!_prisma) _prisma = new PrismaClient();
  return _prisma;
}

const DEMO_USER_EMAIL = "user-demo@maison-papier.fr";

export async function POST(request: NextRequest) {
  try {
    const { calculerTotalCommande } = await import("@/skills/order-total/script");
    const prisma = getPrisma();

    const body = await request.json();
    const items = body?.items;

    if (!Array.isArray(items)) {
      return Response.json({ error: "Le champ 'items' est requis et doit être un tableau." }, { status: 400 });
    }

    const result = await calculerTotalCommande(prisma, items);
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
    if (!user) {
      return Response.json({ error: "Utilisateur par défaut introuvable. Relancez le seed." }, { status: 500 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total: result.total,
          status: "PENDING",
          items: {
            create: result.lines.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
        },
      });

      for (const line of result.lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return newOrder;
    });

    return Response.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur inattendue.";
    console.error("[POST /api/orders]", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
