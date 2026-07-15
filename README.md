# Épreuves d'Examens — Frontend

Interface web de consultation et de gestion des épreuves d'examens universitaires.

Les étudiants parcourent, recherchent et téléchargent les sujets (PDF). Les administrateurs gèrent le contenu via un espace sécurisé.

API associée : [Epreuve-exam-backend](../Epreuve-exam-backend).

---

## Stack

| Technologie | Rôle |
|---|---|
| **React 19** + **TypeScript** | UI |
| **Vite 8** | Build & serveur de dev |
| **React Router 7** | Routing |
| **TanStack Query** | Cache & appels API |
| **Axios** | Client HTTP |
| **Tailwind CSS 4** + **shadcn/ui** | Design system |
| **Motion** | Animations |
| **next-themes** | Thème clair / sombre |

---

## Prérequis

- Node.js 20+
- Backend démarré (par défaut `http://localhost:4000`)

---

## Installation

```bash
npm install
cp .env.example .env
```

### Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_URL` | URL de base de l'API (avec `/api`) | `http://localhost:4000/api` |

---

## Scripts

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # Build de production (tsc + vite)
npm run preview   # Prévisualiser le build
npm run lint      # ESLint
```

---

## Fonctionnalités

### Espace public

- Accueil avec pôles et recherche
- Navigation **Pôle → Filières → Épreuves**
- Catalogue filtrable (pôle, filière, année, session, mot-clé)
- Fiche détail + aperçu / téléchargement PDF
- Interface responsive, thème clair / sombre

### Espace administration (`/admin`)

| Rôle | Droits |
|---|---|
| **Administrateur** | Épreuves de son pôle (création ; modification / suppression uniquement de ses propres publications) |
| **SuperAdmin** | Pôles, filières, années, comptes admin, toutes les épreuves |

Connexion : `/admin/login` (JWT stocké en `localStorage`).

---

## Structure du projet

```
src/
├── components/       # UI, layouts, formulaires, motion
├── context/          # Auth (JWT, rôle)
├── hooks/            # queries & mutations React Query
├── lib/              # api (axios), queryClient, utils
├── pages/
│   ├── public/       # Accueil, pôles, catalogue, détail
│   └── admin/        # Dashboard, CRUD
└── types/            # Types TypeScript partagés
```

Alias d'import : `@/` → `src/`.

---

## Routes

| Chemin | Description |
|---|---|
| `/` | Accueil |
| `/poles/:poleId` | Filières d'un pôle |
| `/epreuves` | Catalogue (filtres en query string) |
| `/epreuves/:id` | Détail d'une épreuve |
| `/admin/login` | Connexion |
| `/admin` | Dashboard |
| `/admin/epreuves` | Gestion des épreuves |
| `/admin/poles` | Pôles *(SuperAdmin)* |
| `/admin/filieres` | Filières *(SuperAdmin)* |
| `/admin/annees` | Années d'étude *(SuperAdmin)* |
| `/admin/admins` | Comptes admin *(SuperAdmin)* |

---

## Développement

1. Lancer le backend (`npm run dev` dans `Epreuve-exam-backend`).
2. Vérifier `VITE_API_URL` dans `.env`.
3. Lancer le frontend : `npm run dev`.
4. Ouvrir [http://localhost:5173](http://localhost:5173).

Le CORS du backend doit autoriser `http://localhost:5173`.
