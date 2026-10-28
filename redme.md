# Nour Academy — Portail d'inscription (Partie 1)

Portail web mobile-first qui permet aux parents de trouver un cours de soutien et d'envoyer un dossier d'inscription **complet**, depuis leur téléphone. Projet réalisé pour Nour Academy (3 centres à Nador) dans le cadre du brief Sahla Digital.

**Objectif mesurable :** passer de 35 % à moins de 15 % de dossiers incomplets, en bloquant toute donnée incorrecte au moment de la saisie.

## Fonctionnalités

| User story | Ce qui est fait |
|---|---|
| **US1 — Parcourir le catalogue** | 14 cours générés en JavaScript depuis `data.js` (aucune carte en dur dans le HTML). Prix au format « 350 MAD / mois ». Un cours à 0 place affiche « Complet » avec un bouton désactivé. |
| **US2 — Filtrer** | Filtres niveau + matière combinés, sans rechargement. Nombre de résultats affiché, message si aucun cours ne correspond. |
| **US3 — Ma sélection** | Un seul écouteur délégué sur le conteneur des cartes (fonctionne aussi après filtrage). Liste des cours choisis, total mensuel, bouton « Retirer ». Impossible d'ajouter deux fois le même cours. |
| **US4 — Validation en temps réel** | 8 champs vérifiés pendant la saisie, avec un message précis sous chaque champ et une bordure qui change d'état (voir les règles ci-dessous). |
| **US5 — Envoi du dossier** | Envoi bloqué si un champ est invalide, si la sélection est vide ou si le consentement n'est pas coché. Résumé des erreurs avec liens, focus sur le premier champ en erreur. Sinon : récapitulatif dans une fenêtre (popup `<dialog>`) avec l'élève, les cours, le total et un numéro de dossier unique, puis remise à zéro du formulaire et de la sélection. |
| **En plus** | Liste des règles du mot de passe cochées en direct, bouton « Afficher / Masquer » le mot de passe, téléchargement du récapitulatif en fichier `.txt`. |

## Règles de validation (Regex)

| Champ | Règle |
|---|---|
| Téléphone | `06` / `07` + 8 chiffres, ou `+212 6` / `+212 7` + 8 chiffres. Espaces, points et tirets acceptés à la saisie. Message précis : « Il manque 3 chiffres. » |
| Email | `nom@domaine.ext`, sans espace |
| Mot de passe | 8 caractères minimum, une majuscule, un chiffre, un caractère spécial (lookaheads) |
| Confirmation | Identique au mot de passe, revérifiée quand le mot de passe change |
| Nom du parent | Lettres uniquement (accents, `'` et `-` acceptés), au moins deux mots (nom **et** prénom) |
| Prénom de l'élève | Lettres uniquement, 2 caractères minimum |
| Niveau | Un niveau doit être choisi |
| Consentement | Case cochée |

## Structure

```
index.html        une seule page : catalogue, sélection, formulaire, popup de récapitulatif
styles.css        design system (variables :root) + styles mobile-first
data.js           le tableau des cours (catalogue statique)
apply.js          rendu, filtres, sélection, validation, envoi
assets/logo.svg
```

Il n'y a pas de serveur : le catalogue vit dans un tableau JavaScript et « envoyer » valide le dossier, affiche le récapitulatif puis remet tout à zéro. Le back-office du secrétariat est prévu pour la Partie 2.

## Lancer le projet

Ouvrir `index.html` dans un navigateur (ou via l'extension Live Server de VS Code). Aucune installation n'est nécessaire.

Déploiement : GitHub Pages, branche `main`, dossier racine.

## Choix du style : CSS natif

J'ai choisi le **CSS natif**, avec le design system déclaré en variables dans `:root` :

- **Aucune étape de build.** Pas de Node, pas de Vite : le dossier se déploie tel quel sur GitHub Pages et s'ouvre directement dans le navigateur.
- **Poids minimal.** Une seule feuille de style écrite à la main, sans framework. Le site complet pèse environ 50 Ko, très loin de la limite de 1 Mo : important pour une connexion 3G/4G instable.
- **Design system centralisé.** Les couleurs (sarcelle `--couleur-primaire`, safran `--couleur-accent`, blanc) et la police Rubik sont définies une seule fois dans `:root`. Changer une couleur se fait à un seul endroit.
- **Contrôle complet du mobile-first.**