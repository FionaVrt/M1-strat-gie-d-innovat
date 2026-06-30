import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchProducts } = await import("@/skills/product-search/script");
    const { searchParams } = request.nextUrl;

    const result = await searchProducts({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
    });

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result.products);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur inattendue.";
    console.error("[GET /api/products]", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
