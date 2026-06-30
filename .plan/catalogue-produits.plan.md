# Plan — Catalogue produits

## Objectif

Afficher la liste des produits du catalogue Maison Papier sur une page dédiée `/produits`, avec une recherche par nom et un filtre par catégorie. La page d'accueil reste une vitrine simple avec un lien vers `/produits`.

---

## Périmètre inclus

- Script de seed avec 8 à 10 produits fictifs papeterie et déco scandinave répartis sur 2 à 3 catégories
- Un skill `product-search` qui encapsule la validation et la recherche
- Endpoint API `GET /api/products` qui appelle ce skill
- Page `/produits` qui affiche les produits en grille
- Champ de recherche texte + sélecteur de catégorie
- Page d'accueil minimale avec lien vers `/produits`

## Périmètre exclus

- Détail produit individuel
- Panier
- Commande
- Authentification

---

## Skill produit

Introduire `skills/product-search/` avec :

- `SKILL.md` — documente l'intention et l'usage du skill
- `script.ts` — contient une fonction pure `searchProducts(params)`, exécutable en standalone via `npx tsx skills/product-search/script.ts` avec des arguments de test, indépendamment du serveur Next.js

La route API devient un simple appelant de ce skill, sans logique métier propre.

---

## Fichiers touchés

| Fichier | Statut |
|---|---|
| `prisma/seed.ts` | nouveau |
| `package.json` | modifié — ajout du script `seed` |
| `skills/product-search/SKILL.md` | nouveau |
| `skills/product-search/script.ts` | nouveau |
| `app/api/products/route.ts` | nouveau |
| `app/produits/page.tsx` | nouveau |
| `app/page.tsx` | modifié — remplace le template Next.js par défaut |
| `components/ProductCard.tsx` | nouveau |

---

## Étapes

1. **`prisma/seed.ts`** — écrire le seed avec des produits réalistes papeterie et déco.

2. **Seed local** — exécuter le seed et vérifier en local que les produits sont en base.

3. **`skills/product-search/script.ts`** — écrire le skill avec le gate déterministe :
   - `search` : chaîne de 1 à 100 caractères si présent
   - `category` : chaîne correspondant à une catégorie existante si présente
   - Rejet explicite sinon

4. **Test standalone** — tester le skill avec des arguments valides et invalides avant de le brancher à une route HTTP.

5. **`app/api/products/route.ts`** — appelle le skill et traduit son résultat ou son erreur en réponse HTTP.

6. **`components/ProductCard.tsx`** — afficher nom, prix, catégorie.

7. **`app/produits/page.tsx`** — grille avec recherche et filtre.

8. **`app/page.tsx`** — vitrine minimale avec lien vers `/produits`.

9. **Vérification manuelle complète** — recherche seule, filtre seul, combinaison, requête invalide.

---

## Gate déterministe

Porté par `skills/product-search/script.ts`, appelé en standalone et depuis la route API.

- `search` (optionnel) : chaîne de **1 à 100 caractères** — rejet si vide ou trop long
- `category` (optionnel) : doit correspondre à **une catégorie existante** — rejet si valeur inconnue

Toute requête invalide renvoie une erreur de validation explicite, traduite en `400` côté route API, sans toucher à la base de données.

---

## Critères de réussite

- `/produits` affiche tous les produits seedés par défaut
- La recherche par nom filtre correctement, insensible à la casse
- Le filtre par catégorie fonctionne seul et combiné à la recherche
- Une requête avec paramètres invalides ne fait pas planter le serveur
- La page d'accueil n'est plus le template Next.js par défaut
