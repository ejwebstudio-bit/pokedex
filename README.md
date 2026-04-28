
# Pokédex — Full-Stack Pokémon Manager

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

Une application web complète pour explorer, rechercher et gérer vos Pokémon préférés. Développée avec **React + TypeScript** (frontend) et **Node.js + Express + Sequelize** (backend), avec une base PostgreSQL.

---

## ✨ Fonctionnalités

- **🔍 Recherche & Filtres** — Filtrez par type, nom et bien plus
- **📋 Équipes personnalisées** — Créez et gérez vos équipes de Pokémon
- **❤️ Favoris** — Marquez vos Pokémon préférés
- **📊 Dashboard** — Statistiques, top Pokémon et faits amusants
- **🎨 Thème clair/sombre** — Basculez en un clic
- **🏆 Niveau d'équipe** — Chaque équipe a un niveau calculé dynamiquement
- **📱 Interface responsive** — Adaptée à tous les écrans

## 🏗️ Architecture

```
pokedex/
├── back/              # Backend (API REST)
│   ├── app/
│   │   ├── controllers/   # Logique métier (Pokémon, Types, Équipes)
│   │   ├── models/       # Modèles Sequelize
│   │   ├── database.js   # Configuration DB
│   │   └── router.js     # Routes API
│   ├── data/             # Données initiales
│   ├── index.js          # Point d'entrée
│   └── .env.example
├── front/             # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/   # Composants réutilisables (Card, MenuBar, UI...)
│   │   ├── hooks/        # Custom hooks (useFavorites, useTheme...)
│   │   ├── pages/        # Pages (Accueil, Dashboard, Équipes)
│   │   ├── store/        # State management (Redux Toolkit)
│   │   └── main.tsx      # Point d'entrée
│   ├── index.html
│   └── .env.example
├── package.json       # Scripts racine (lance front + back en parallèle)
└── README.md
```

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** ≥ 18
- **PostgreSQL** (avec une base de données créée)
- **npm** ou **yarn**

### 1. Cloner le dépôt

```bash
git clone https://github.com/EnricOclock/pokedex.git
cd pokedex
```

### 2. Installer les dépendances

```bash
# Dépendances racine
npm install

# Dépendances backend
cd back && npm install && cd ..

# Dépendances frontend
cd front && npm install && cd ..
```

### 3. Configurer l'environnement

```bash
# Backend
cp back/.env.example back/.env
```

Éditez `back/.env` avec vos informations PostgreSQL :

```env
PORT=3000
PG_URL=postgres://user:password@localhost:5432/pokedex
```

### 4. Lancer l'application

```bash
npm run dev
```

Lance le backend (http://localhost:3000) et le frontend (http://localhost:5173) simultanément.

## 📡 API REST

Le backend expose une API REST documentée avec Swagger :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/pokemons` | Liste tous les Pokémon |
| GET | `/api/pokemons/:id` | Détail d'un Pokémon |
| GET | `/api/pokemons/filtered` | Recherche filtrée |
| GET | `/api/pokemons/random` | Pokémon aléatoire |
| GET | `/api/types` | Liste tous les types |
| GET | `/api/teams` | Liste les équipes |
| POST | `/api/teams` | Crée une équipe |
| PUT | `/api/teams/:id` | Modifie une équipe |
| DELETE | `/api/teams/:id` | Supprime une équipe |
| POST | `/api/teams/:id/pokemons` | Ajoute un Pokémon à une équipe |
| DELETE | `/api/teams/:id/pokemons/:pokemonId` | Retire un Pokémon d'une équipe |

## 🚢 Branches

Le projet utilise un workflow basé sur plusieurs branches de fonctionnalités :

| Branche | Statut |
|---------|--------|
| `main` | 🟢 Stable |
| `dev` | 🟡 Développement |
| `search-filters` | ✅ Recherche et filtres |
| `team-edition` | ✅ Édition des équipes |
| `dashboard` | ✅ Dashboard statistiques |
| `dark-light-theme` | ✅ Thème clair/sombre |
| `team-level` | ✅ Niveau des équipes |
| `favorites` | ✅ Système de favoris |

## 🧰 Stack technique

### Frontend
- **React 19** + **TypeScript**
- **Vite** (bundler)
- **Redux Toolkit** (état global)
- **React Router** (routing)
- **Tailwind CSS 4** (styles)
- **Framer Motion** / **Motion** (animations)
- **Lucide React** (icônes)

### Backend
- **Node.js** + **Express**
- **Sequelize** (ORM)
- **PostgreSQL** (base de données)
- **Swagger** (documentation API)

## 📄 Licence

ISC — libre d'utilisation et de modification.

---

*Projet réalisé par [EnricOclock](https://github.com/EnricOclock)*
