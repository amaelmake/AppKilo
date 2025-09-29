# 🚗 Kilométrik

Une application SaaS pour gérer vos trajets professionnels et calculer vos indemnités kilométriques selon le barème français.

## ✨ Fonctionnalités

- **Gestion des trajets** : Ajout manuel de trajets avec calcul automatique des distances
- **Calcul des indemnités** : Utilisation du barème kilométrique français officiel
- **Gestion des véhicules** : Support multi-véhicules avec CV fiscaux
- **Exports** : Génération de PDF/CSV pour vos déclarations
- **Interface moderne** : Design mobile-first avec Tailwind CSS

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### Configuration

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd kilometrik
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Modifiez `.env.local` avec vos paramètres :
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/kilometrik"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Maps (optionnel pour le MVP)
   MAPS_PROVIDER="mapbox"
   MAPBOX_TOKEN="your-mapbox-token"
   ```

4. **Configuration de la base de données**
   ```bash
   # Générer le client Prisma
   npm run db:generate
   
   # Appliquer les migrations
   npm run db:push
   
   # Peupler avec les données de base (barème 2025)
   npm run db:seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Stack technique

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL
- **Authentification** : NextAuth.js
- **UI** : shadcn/ui, Radix UI
- **Validation** : Zod

### Structure du projet

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   └── dashboard/         # Pages principales
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   └── layout/           # Layout et navigation
└── lib/                  # Utilitaires et configuration
    ├── auth.ts           # Configuration NextAuth
    ├── bareme.ts         # Moteur de calcul des indemnités
    ├── db.ts             # Client Prisma
    ├── types.ts          # Types TypeScript
    └── validations.ts    # Schémas Zod
```

## 📊 Barème Kilométrique

L'application utilise le barème kilométrique français officiel 2025. Le calcul est basé sur :

- **CV fiscaux** du véhicule (1-3, 4-5, 6, 7, 8-10, 11, 12-14, 15-16, 17-20, 21+)
- **Distance** parcourue avec segments (0-5000km, 5001-20000km, 20000km+)
- **Formules** : `a*D + b` où D = distance en km

### Exemple de calcul

Pour un véhicule de 6 CV fiscaux parcourant 1000 km :
- Segment 0-5000km : `0.636 * 1000 = 636€`

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Lancer en mode développement
npm run build           # Build de production
npm run start           # Lancer en production

# Base de données
npm run db:generate     # Générer le client Prisma
npm run db:push         # Appliquer les changements de schéma
npm run db:migrate      # Créer et appliquer une migration
npm run db:seed         # Peupler la base avec des données de test
npm run db:studio       # Interface graphique Prisma

# Qualité
npm run lint            # Linter ESLint
```

## 🧪 Données de test

Le script de seed crée :
- Un utilisateur démo : `demo@kilometrik.fr` / `demo123`
- Un véhicule de test (Peugeot 308, 6 CV)
- Quelques trajets d'exemple
- Toutes les données du barème 2025

## 📱 Pages principales

- **`/`** : Redirection vers dashboard ou login
- **`/auth/signin`** : Connexion
- **`/auth/signup`** : Inscription
- **`/dashboard`** : Tableau de bord avec statistiques
- **`/trips`** : Liste des trajets
- **`/vehicles`** : Gestion des véhicules
- **`/exports`** : Génération d'exports

## 🔐 Sécurité

- Authentification sécurisée avec NextAuth.js
- Hachage des mots de passe avec bcrypt
- Validation des données avec Zod
- Protection CSRF intégrée
- Variables d'environnement pour les secrets

## 🚀 Déploiement

### Vercel (recommandé)

1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement de production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
MAPBOX_TOKEN="..." # Optionnel
```

## 📈 Roadmap

### v1.0 (MVP)
- [x] Authentification
- [x] Gestion des véhicules
- [x] Ajout de trajets manuels
- [x] Calcul des indemnités
- [x] Dashboard avec statistiques

### v1.1
- [ ] Intégration GPS en temps réel
- [ ] OAuth (Google, Apple)
- [ ] Notifications push
- [ ] Exports PDF/CSV avancés

### v1.2
- [ ] Gestion de flotte (multi-utilisateurs)
- [ ] Intégrations comptables
- [ ] Support multi-pays

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Kilométrik** - Simplifiez la gestion de vos trajets professionnels 🚗