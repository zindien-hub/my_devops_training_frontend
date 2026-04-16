# EtudiantFrontend

Front-end Angular (v19) pour l'exercice d'authentification.

## Fonctionnalites implementees

- Ecran `Login` avec formulaire (login + mot de passe obligatoires).
- Ecran `Register` existant conserve.
- Navigation simple avec boutons `Login` et `Register`.
- Route par defaut `/` redirigee vers `/login`.
- Appel front -> back sur `/api/login` et `/api/register`.
- Gestion des etats cote login: chargement, erreur, succes (token recu).

## Routes disponibles

- `/login`: ecran de connexion.
- `/register`: ecran d'inscription.
- `/`: redirection vers `/login`.

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
npm start
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
