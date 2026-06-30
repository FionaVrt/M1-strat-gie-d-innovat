# Plan — Panier et passage de commande

## Objectif

Permettre à un visiteur d’ajouter des produits à un panier côté client, de le consulter, puis de passer commande. La commande est créée en base, le stock des produits est décrémenté, et le panier est vidé après succès.

## Contexte

Pas d’authentification dans ce workshop. Toutes les commandes sont rattachées à un utilisateur par défaut unique appelé `user-demo`, créé via le seed. Le panier vit uniquement côté client en React Context, il n’est pas persisté en base ni entre sessions.

---

## Périmètre inclus

- Ajout d’un utilisateur par défaut dans le seed
- Contexte React `CartContext` pour ajout / suppression / modification de quantité / calcul du total côté client
- Page `/panier` avec liste des articles et bouton « Passer commande »
- Bouton « Ajouter au panier » sur chaque `ProductCard`
- Skill métier `order-total` qui calcule le total réel d’une commande à partir des prix en base — jamais du client
- Endpoint `POST /api/orders` qui valide via le skill, vérifie le stock, calcule le total, crée `Order` et `OrderItem`, décrémente le stock
- Page de confirmation après commande réussie

## Périmètre exclus

- Authentification
- Paiement réel
- Modification ou annulation de commande existante
- Persistance du panier en base ou cookie

---

## Fichiers touchés

| Fichier | Statut |
|---|---|
| `prisma/seed.ts` | modifié |
| `skills/order-total/SKILL.md` | nouveau |
| `skills/order-total/script.ts` | nouveau |
| `app/api/orders/route.ts` | nouveau |
| `lib/cart-context.tsx` | nouveau |
| `app/produits/page.tsx` | modifié |
| `components/ProductCard.tsx` | modifié |
| `app/panier/page.tsx` | nouveau |
| `app/commande/confirmation/page.tsx` | nouveau |
| `app/layout.tsx` | modifié — CartProvider + lien panier dans la navigation |

---

## Étapes

1. **`prisma/seed.ts`** — ajouter la création d’un utilisateur par défaut `user-demo`.

2. **`lib/cart-context.tsx`** — état du panier, fonctions `addItem`, `removeItem`, `updateQuantity`, `clearCart`, total calculé en mémoire.

3. **`app/layout.tsx`** — envelopper l’app avec `CartProvider`, ajouter lien panier avec compteur d’articles dans la navigation.

4. **`components/ProductCard.tsx` + `app/produits/page.tsx`** — ajouter bouton « Ajouter au panier ».

5. **`app/panier/page.tsx`** — liste des articles, modification de quantité, suppression, total, bouton « Passer commande ».

6. **`skills/order-total/script.ts` + `skills/order-total/SKILL.md`** — fonction `calculerTotalCommande` qui :
   - Vérifie que chaque quantité est un entier strictement positif
   - Récupère le prix réel du produit en base (jamais celui du client)
   - Vérifie que le stock est suffisant
   - Calcule le total
   - Est testable en standalone via `npx tsx skills/order-total/script.ts`

7. **`app/api/orders/route.ts`** — reçoit la liste d’items, appelle le skill, si valide crée `Order` (statut `PENDING`, total calculé) et les `OrderItem` dans une **transaction Prisma**, décrémente le stock, renvoie l’id de la commande ; si invalide renvoie `400` avec le détail de l’erreur.

8. **Branchement bouton « Passer commande »** — si succès : vider le panier et rediriger vers la confirmation ; si échec : afficher l’erreur en texte, pas l’objet brut.

9. **`app/commande/confirmation/page.tsx`** — message de succès, numéro de commande, lien retour catalogue.

10. **Vérification manuelle complète** — cas nominal + cas stock insuffisant rejeté proprement sans crash et sans modifier le stock.

---

## Gate déterministe

Porté par `skills/order-total/script.ts`, appelé depuis la route API.

| Règle | Comportement si invalide |
|---|---|
| Quantité entière strictement positive | erreur 400, base non touchée |
| `productId` correspond à un produit existant | erreur 400, base non touchée |
| Quantité ≤ stock disponible | erreur 400, base non touchée |
| Prix = `Product.price` en base (jamais du client) | garanti structurellement |

Toute violation renvoie une erreur de validation explicite et empêche toute écriture partielle en base.

---

## Critères de réussite

- Un visiteur peut ajouter plusieurs produits au panier et voir le total se mettre à jour
- La page panier permet de modifier les quantités et retirer un article
- Une commande valide crée `Order` et `OrderItem` en base et décrémente le stock
- Une commande avec quantité supérieure au stock est rejetée proprement avec message clair — sans page d’erreur brute et sans donnée corrompue en base
- Le total affiché côté client et le total enregistré en base correspondent car les deux découlent du même calcul serveur
