import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateProductQuery, isValidationError } from "@/lib/validation";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const validation = validateProductQuery(request.nextUrl.searchParams);

  if (isValidationError(validation)) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const { search, category } = validation.params;

  const products = await prisma.product.findMany({
    where: {
      ...(search && {
        name: { contains: search },
      }),
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

  return Response.json(products);
}
