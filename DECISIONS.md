# Décisions techniques

## 2026-06-29 — Choix du sujet et de la stack

**Décision** : mini e-shop de papeterie et déco minimaliste appelé Maison Papier, stack Next.js 14+ App Router, TypeScript, Tailwind CSS, Prisma avec SQLite.

**Justification** : sujet validé par le formateur. Stack full-stack dans un seul repo pour limiter la complexité d'infrastructure et laisser du temps pour la méthode plutôt que pour du debugging d'intégration. SQLite choisi plutôt que Postgres pour éviter la configuration d'un serveur externe tout en gardant un vrai modèle relationnel.

---

## 2026-06-29 — API routes plutôt que server actions

**Décision** : utilisation d'API routes classiques dans `app/api` au lieu de server actions Next.js.

**Justification** : les API routes rendent les fonctionnalités cadrées plus faciles à isoler en skills indépendants et testables.

---

## 2026-06-29 — Scaffolding initial exécuté dans un environnement cloud

**Décision** : le scaffolding Next.js et Prisma a été lancé via l'application desktop Claude Code connectée à un dépôt distant, ce qui a exécuté les commandes dans un environnement cloud plutôt que sur la machine locale.

**Contexte** : le téléchargement du moteur binaire de Prisma a été bloqué par la politique réseau du conteneur cloud, contourné en installant les paquets avec `--ignore-scripts` et en créant manuellement les fichiers que `prisma init` aurait générés. Plusieurs manipulations Git ont aussi été faites de façon autonome avant validation.

**Résolution** : le travail a été isolé sur une branche et une Pull Request, relue avant fusion manuelle dans `main`. Une fois le code récupéré en local via `git pull`, les étapes bloquées par le réseau cloud ont été complétées localement avec `npx prisma generate` puis `npx prisma migrate dev --name init`.

**Leçon retenue** : pour la suite, le scaffolding et les modifications structurelles seront pilotés depuis le terminal local plutôt que via l'app desktop connectée à un dépôt distant.

---

## 2026-06-29 — Schéma de données initial

**Décision** : quatre entités `User`, `Product`, `Order`, `OrderItem` avec les relations User → plusieurs Order, Order → plusieurs OrderItem, OrderItem → un Product. Le prix unitaire est dupliqué dans `OrderItem` comme snapshot au moment de l'achat plutôt que recalculé depuis `Product.price`.

**Justification** : ce découpage couvre la complexité minimale demandée sans complexité superflue. Le snapshot du prix évite qu'une modification ultérieure du prix d'un produit ne fausse rétroactivement le total de commandes déjà passées.
