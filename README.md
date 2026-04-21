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

Le projet contient 2 types de tests:

- Tests unitaires (Jest) pour les composants, services, guard et interceptor.
- Tests end-to-end (Cypress) pour les parcours utilisateur principaux.

### Lancer les tests unitaires (Jest)

```bash
npm test
```

Mode watch:

```bash
npm run test:watch
```

Rapport de couverture:

```bash
npm test -- --coverage --watch=false --coverageReporters=text-summary
```

Couverture de tests
Jest

La couverture front mesurée avec Jest est supérieure à 80 % :
- Statements : 92.27 %
- Branches : 66.66 %
- Functions : 80.85 %
- Lines : 91.63 %

### Lancer les tests E2E (Cypress)

Mode interface:

```bash
npm run cy:open
```

Mode headless:

```bash
npm run cy:run
```

### Scenarios testes

Unitaires:

- Authentification: `AuthService`, `AuthGuard`, `AuthInterceptor`.
- Gestion des etudiants: `StudentService`, `UserService`.
- Composants/pages: `AppComponent`, `Login`, `Register`, `StudentsList`, `StudentDetail`, `StudentForm`.

E2E:

- Connexion utilisateur.
- Inscription utilisateur.
- Consultation de la liste des etudiants.
- Consultation du detail d'un etudiant.
- Creation/modification d'un etudiant.
- Suppression d'un etudiant.

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
