# Suivi de cours ÉTS

Tableau de bord académique personnel (notes, horaire, profil étudiant) inspiré de l'application ÉTSMobile. Application React d'une seule page, sans serveur.

## Publier sur GitHub Pages

1. Crée un dépôt GitHub et pousse ce dossier.
2. Dans **Settings → Pages**, choisis **Deploy from a branch**, la branche `main` et le dossier **/docs**.
3. Le site sera disponible à `https://<ton-utilisateur>.github.io/<nom-du-depot>/`.

Le fichier `docs/index.html` est déjà généré : aucune étape de build n'est nécessaire pour publier.

## Modifier l'application

Le code source est dans `src/app.jsx` (données de cours et horaire en haut du fichier).

```bash
npm install
npm run build   # régénère docs/index.html
```

Aperçu local : ouvre `docs/index.html` dans le navigateur.

## Notes

- React est chargé depuis cdnjs, donc une connexion Internet est nécessaire.
- Les données sont intégrées dans le code. Si tu modifies les données de départ, augmente `CURRENT_VERSION` dans `src/app.jsx` pour forcer le rafraîchissement du stockage local du navigateur.
