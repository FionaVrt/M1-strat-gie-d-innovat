# Skill — export-orders

## Intention

Exporte l’historique des commandes pour analyse ou archivage hors de l’application web.
Peut être exécuté à tout moment en standalone, indépendamment du serveur Next.js.

## Entrées

| Argument | Position | Valeurs | Défaut |
|---|---|---|---|
| `format` | 1 | `csv` ou `json` | `json` |
| `dateDebut` | 2 | `YYYY-MM-DD` | _(aucune)_ |
| `dateFin` | 3 | `YYYY-MM-DD` | _(aucune)_ |

Les dates sont optionnelles mais doivent être fournies ensemble si l’une est présente.

## Sorties

Fichier écrit dans `exports/` à la racine du projet :
- `exports/orders-export-[timestamp].json`
- `exports/orders-export-[timestamp].csv`

Le dossier `exports/` est créé automatiquement s’il n’existe pas.
Il est listé dans `.gitignore` — les exports ne sont jamais committés.

## Exécution standalone

```bash
# Toutes les commandes, format JSON (défaut)
npm run export-orders

# Format CSV
npm run export-orders -- csv

# Plage de dates, format JSON
npm run export-orders -- json 2025-01-01 2025-12-31

# Plage de dates, format CSV
npm run export-orders -- csv 2025-06-01 2025-06-30
```

## Structure des sorties

### JSON
```json
[
  {
    "orderId": 1,
    "date": "2025-06-30T10:00:00.000Z",
    "status": "PENDING",
    "total": 33.40,
    "items": [
      { "productId": 2, "product": "Carnet pointillé B5", "quantity": 1, "unitPrice": 18.50, "lineTotal": 18.50 }
    ]
  }
]
```

### CSV
```
orderId,date,status,productId,product,quantity,unitPrice,lineTotal
1,2025-06-30T10:00:00.000Z,PENDING,2,Carnet pointillé B5,1,18.50,18.50
```

## Gate déterministe

| Règle | Comportement si invalide |
|---|---|
| `format` ∈ { csv, json } | erreur claire, aucun fichier écrit |
| Dates au format `YYYY-MM-DD` | erreur claire, aucun fichier écrit |
| `dateDebut` ≤ `dateFin` | erreur claire, aucun fichier écrit |
