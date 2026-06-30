export type ProductQueryParams = {
  search?: string;
  category?: string;
};

export type ValidationError = { error: string };
export type ValidationSuccess = { params: ProductQueryParams };

const VALID_CATEGORIES = ["Papeterie", "Déco", "Art de la table"] as const;

export function validateProductQuery(
  searchParams: URLSearchParams
): ValidationSuccess | ValidationError {
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  if (search !== undefined) {
    if (search.length === 0 || search.length > 100) {
      return {
        error: "Le paramètre 'search' doit contenir entre 1 et 100 caractères.",
      };
    }
  }

  if (category !== undefined) {
    if (!(VALID_CATEGORIES as readonly string[]).includes(category)) {
      return {
        error: `Catégorie invalide. Valeurs acceptées : ${VALID_CATEGORIES.join(", ")}.`,
      };
    }
  }

  return { params: { search, category } };
}

export function isValidationError(
  result: ValidationSuccess | ValidationError
): result is ValidationError {
  return "error" in result;
}
