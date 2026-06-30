import { type NextRequest } from "next/server";
import { searchProducts } from "@/skills/product-search/script";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const result = await searchProducts({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result.products);
}
