# Skill — product-search

## Intention

Encapsule la validation des paramètres et la recherche de produits en base.
Peut être utilisé depuis une route API Next.js ou exécuté en standalone pour tester la logique sans lancer le serveur.

## Usage

### Depuis la route API

```ts
import { searchProducts } from "@/skills/product-search/script";

const result = await searchProducts({ search: "carnet", category: "Papeterie" });
if (!result.ok) {
  return Response.json({ error: result.error }, { status: 400 });
}
return Response.json(result.products);
```

### En standalone

```bash
npx tsx skills/product-search/script.ts
npx tsx skills/product-search/script.ts carnet
npx tsx skills/product-search/script.ts "" Papeterie
npx tsx skills/product-search/script.ts "" Invalide
npx tsx skills/product-search/script.ts "$(python3 -c "print('x'*101)")"
```

## Gate déterministe

| Paramètre | Règle | Comportement si invalide |
|---|---|---|
| `search` | chaîne de 1 à 100 caractères si présent | erreur 400, base non touchée |
| `category` | doit correspondre à une catégorie existante si présent | erreur 400, base non touchée |

## Catégories valides

- `Papeterie`
- `Déco`
- `Art de la table`
