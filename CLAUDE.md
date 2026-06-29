# CLAUDE.md — Maison Papier

## Intent

Maison Papier est un mini e-shop de papeterie et déco minimaliste (esthétique
scandinave : lin, papier kraft, formes simples). Ce projet est réalisé dans le
cadre du workshop "Stratégie de l'Innovation & IA générative avec Claude Code"
(IIM, M1 IWID, 29 juin → 2 juillet 2026).

L'objectif du workshop n'est pas seulement de livrer un produit fonctionnel,
mais de démontrer une méthode de pilotage de Claude Code : plans validés avant
exécution, skills documentés avec scripts déterministes, décisions tracées,
gates de validation. Le code doit rester simple et lisible : on optimise pour
la clarté du cadrage, pas pour la richesse fonctionnelle.

## Stack

- Next.js 14+ (App Router)
- TypeScript strict
- Prisma + SQLite (fichier local `dev.db`)
- API routes classiques (`app/api/.../route.ts`) — pas de server actions sur ce projet
- Pas de framework CSS lourd : CSS Modules ou Tailwind (à trancher au démarrage du front), pas de UI kit générique

## Entités du domaine

| Entité      | Rôle                                                          |
| ----------- | -------------------------------------------------------------- |
| `User`      | Compte client (email, mot de passe hashé, rôle)                |
| `Product`   | Article du catalogue (nom, prix, stock, description, catégorie) |
| `Order`     | Commande passée par un `User`, statut + total                  |
| `OrderItem` | Ligne de commande : `Product` + quantité + prix au moment de l'achat |

Relations : `User` 1—N `Order` ; `Order` 1—N `OrderItem` ; `OrderItem` N—1 `Product`.
Le stock d'un `Product` est décrémenté à la création d'une `Order`.

## Conventions de nommage

- **camelCase** pour variables, fonctions, propriétés d'objets et champs Prisma (ex: `userId`, `calculerTotalCommande`)
- **PascalCase** pour les types, interfaces, composants React et modèles Prisma (ex: `Product`, `OrderItem`, `ProductCard`)
- **kebab-case** pour les noms de fichiers de routes et dossiers (`app/api/orders/route.ts`)
- Noms de fonctions en français OU anglais : on choisit **anglais** pour le code, **français** pour la doc/commentaires métier (cohérence avec ce fichier)
- Pas d'abréviations obscures : `quantity` plutôt que `qty`, `product` plutôt que `prod`

## Structure de dossiers (cible)

```
app/
  api/
    products/route.ts
    orders/route.ts
  (routes pages...)
lib/
  order.ts          # logique métier commande (skill métier)
  validation.ts      # gates déterministes
prisma/
  schema.prisma
skills/
  order-total/        # skill métier
    SKILL.md
    script.ts
  export-catalog/      # skill transverse
    SKILL.md
    script.ts
.plan/
  *.plan.md           # plans validés avant exécution, un par fonctionnalité cadrée
DECISIONS.md
```

## Règles de travail avec Claude Code

1. Pour toute fonctionnalité "cadrée" (passage de commande, catalogue/recherche),
   un `.plan.md` est écrit et relu avant toute génération de code. Le plan
   liste : objectif, fichiers touchés, étapes, gate de validation.
2. Une fois le plan validé, l'implémentation doit le suivre sans dériver. Toute
   déviation nécessaire est notée dans `DECISIONS.md`, pas improvisée en silence.
3. Chaque décision technique notable (choix de lib, structure de données,
   compromis) est ajoutée à `DECISIONS.md` avec une justification courte.
4. Les skills sont documentés (`SKILL.md` + script déterministe testable) et
   ne sont pas de simples bouts de code : ils doivent pouvoir être exécutés et
   vérifiés indépendamment du reste de l'app.
5. Pas d'IA en runtime sauf besoin clairement justifié (le brief autorise mais
   ne l'impose pas — éviter le coût et la complexité inutiles).

## Anti-patterns à éviter

- Ne pas dupliquer la logique de calcul de total entre le front et l'API :
  une seule source de vérité dans `lib/order.ts`.
- Ne pas laisser Claude Code modifier le schéma Prisma sans passer par un
  `.plan.md` si la fonctionnalité concernée est une fonctionnalité "cadrée".
- Ne pas committer `dev.db` avec des données de seed sensibles ou volumineuses.
