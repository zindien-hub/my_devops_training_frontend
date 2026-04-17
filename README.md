# EtudiantFrontend

Front-end Angular (v19) pour l'exercice d'authentification.

## Fonctionnalites implementees

- Ecran `Login` avec formulaire (login + mot de passe obligatoires).
- Ecran `Register` existant conserve.
- Navigation simple avec boutons `Login` et `Register`.
- Route par defaut `/` redirigee vers `/login`.
- Appel front -> back sur `/api/login` et `/api/register`.
- Gestion des etats cote login: chargement, erreur, succes (token recu).
- Stockage du token JWT dans le `localStorage`
- Protection des routes étudiants avec un `Guard`
- Ajout automatique du token JWT dans les requêtes HTTP via un `Interceptor`

### Gestion des étudiants
- Consulter la liste des étudiants
- Consulter le détail d’un étudiant
- Ajouter un nouvel étudiant
- Modifier un étudiant
- Supprimer un étudiant

## Routes disponibles

### Routes publiques
- `/login`: ecran de connexion.
- `/register`: ecran d'inscription.
- `/`: redirection vers `/login`.

### Routes protégées
- `/students` : liste des étudiants
- `/students/new` : création d’un étudiant
- `/students/:id` : détail d’un étudiant
- `/students/:id/edit` : modification d’un étudiant

## Prerequis

- Node.js + npm
- Backend demarre sur `http://localhost:8080`

Le proxy Angular est configure pour rediriger `/api/*` vers `http://localhost:8080` via `proxy.conf.json`.

## Lancer le projet

Installer les dependances:

```bash
npm install
```

Demarrer le front en developpement:

```bash
npm run start
```

Puis ouvrir:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

## Tests

Executer les tests unitaires:

```bash
npm test
```

Mode watch:

```bash
npm run test:watch
```

## Notes techniques

- Le backend retourne le token JWT en JSON sur `/api/login`.
- Format attendu: `{ "token": "xxxxx" }`.
- Le token est stocké côté front dans le localStorage
- Les routes étudiants sont protégées par un Guard
- Les appels HTTP vers les routes protégées ajoutent automatiquement : `Authorization: Bearer <token>`

## APIs backend consommées

### Authentification

- POST /api/register
- POST /api/login

### Étudiants

- GET /api/students
- GET /api/students/{id}
- POST /api/students
- PUT /api/students/{id}
- DELETE /api/students/{id}
