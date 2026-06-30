# Plan — Catalogue produits

## Objectif

Afficher la liste des produits du catalogue Maison Papier sur une page dédiée `/produits`, avec une recherche par nom et un filtre par catégorie. La page d'accueil reste une vitrine simple avec un lien vers `/produits`.

---

## Périmètre inclus

- Script de seed avec 8 à 10 produits fictifs papeterie et déco scandinave répartis sur 2 à 3 catégories
- Endpoint API `GET /api/products` avec paramètres optionnels `search` et `category`
- Page `/produits` qui affiche les produits en grille avec nom, prix, image placeholder et catégorie
- Champ de recherche texte + sélecteur de catégorie
- Page d'accueil minimale avec présentation courte de Maison Papier et lien vers `/produits`

## Périmètre exclus

- Détail produit individuel
- Panier
- Commande
- Authentification

---

## Fichiers touchés

| Fichier | Statut |
|---|---|
| `prisma/seed.ts` | nouveau |
| `package.json` | modifié — ajout du script `seed` |
| `lib/validation.ts` | nouveau |
| `app/api/products/route.ts` | nouveau |
| `app/produits/page.tsx` | nouveau |
| `app/page.tsx` | modifié — remplace le template Next.js par défaut |
| `components/ProductCard.tsx` | nouveau |

---

## Étapes

1. **`prisma/seed.ts`** — écrire le seed avec des produits réalistes papeterie et déco (carnets, vases en grès, bougies, sets de table en lin…) répartis sur des catégories cohérentes.

2. **Seed local** — exécuter le seed et vérifier en local que les produits sont en base.

3. **`lib/validation.ts`** — écrire le gate déterministe qui valide :
   - `search` : chaîne de 1 à 100 caractères si présent
   - `category` : chaîne correspondant à une catégorie existante si présente
   - Rejet en erreur 400 si invalide

4. **`app/api/products/route.ts`** — utiliser cette validation puis interroger Prisma avec les filtres.

5. **`components/ProductCard.tsx`** — afficher nom, prix, catégorie.

6. **`app/produits/page.tsx`** — appeler l'API et afficher la grille avec recherche et filtre.

7. **`app/page.tsx`** — vitrine minimale avec titre, accroche courte et lien vers `/produits`.

8. **Vérification manuelle** — recherche seule, filtre seul, combinaison des deux fonctionnent ; une requête invalide renvoie 400 sans crash.

---

## Gate déterministe

Validation des paramètres de la requête `GET /api/products` :

- `search` (optionnel) : chaîne de **1 à 100 caractères** — rejet 400 si vide ou trop long
- `category` (optionnel) : doit correspondre à **une catégorie existant en base** — rejet 400 si valeur inconnue

Toute requête avec paramètres invalides renvoie `400` avec un message d'erreur explicite **sans toucher à la base de données**.

---

## Critères de réussite

- `/produits` affiche tous les produits seedés par défaut
- La recherche par nom filtre correctement, insensible à la casse
- Le filtre par catégorie fonctionne seul et combiné à la recherche
- Une requête avec paramètres invalides ne fait pas planter le serveur
- La page d'accueil n'est plus le template Next.js par défaut
