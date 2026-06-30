# Skill — order-total

## Intention

Calcule le total réel d’une commande à partir des prix en base de données — jamais des valeurs transmises par le client. Vérifie simultanément la validité de chaque item (quantité positive, produit existant, stock suffisant).

## Usage

### Depuis la route API

```ts
import { calculerTotalCommande } from "@/skills/order-total/script";

const result = await calculerTotalCommande(prisma, [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
]);
if (!result.ok) {
  return Response.json({ error: result.error }, { status: 400 });
}
// result.total     — total en euros
// result.lines     — détail par ligne avec unitPrice et productId
```

### En standalone

```bash
npx tsx skills/order-total/script.ts
npx tsx skills/order-total/script.ts 1:2 3:1
npx tsx skills/order-total/script.ts 1:0
npx tsx skills/order-total/script.ts 999:1
```

Format des arguments : `productId:quantity` séparés par des espaces.

## Gate déterministe

| Règle | Comportement si invalide |
|---|---|
| Quantité entière strictement positive | erreur explicite, base non touchée |
| `productId` correspond à un produit existant | erreur explicite, base non touchée |
| Quantité ≤ stock disponible | erreur explicite, base non touchée |
| Prix utilisé = `Product.price` en base | garanti structurellement |
