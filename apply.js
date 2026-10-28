const conteneurCartes = document.querySelector(".cartes");
const compteur = document.querySelector(".resultats");
const aucunResultat = document.querySelector(".aucun-resultat");
const filtreNiveau = document.querySelector("#filtre-niveau");
const filtreMatiere = document.querySelector("#filtre-matiere");
const selectionNombre = document.querySelector(".selection-nombre");
const selectionVide = document.querySelector(".selection-vide");
const selectionListe = document.querySelector(".selection-liste");
const selectionTotal = document.querySelector(".selection-total");
const selectionMontant = document.querySelector(".selection-montant");
const btnContinuer = document.querySelector(".btn-continuer");
const rappelValeur = document.querySelector(".rappel-valeur");

let selection = [];

function textePlaces(places) {
  if (places === 0) {
    return "Aucune place restante";
  }
  if (places === 1) {
    return "1 place restante";
  }
  return places + " places restantes";
}

function texteCompteur(nombre) {
  if (nombre === 0) {
    return "Aucun cours trouvé";
  }
  if (nombre === 1) {
    return "1 cours trouvé";
  }
  return nombre + " cours trouvés";
}

function afficherCours(liste) {
  let html = "";

  for (const c of liste) {
    let classeCarte = "carte";
    let tagSelection = "";
    let bouton = `<button class="btn" type="button" data-id="${c.id}">Ajouter</button>`;

    const estChoisi = selection.some(function (s) {
      return s.id === c.id;
    });

    if (c.places === 0) {
      classeCarte = "carte carte--complet";
      bouton = `<button class="btn btn--complet" type="button" disabled>Complet</button>`;
    } else if (estChoisi) {
      classeCarte = "carte carte--ajoutee";
      tagSelection = `<span class="tag tag--selection">Dans ma sélection</span>`;
      bouton = `<button class="btn btn--ajoute" type="button" disabled>Ajouté</button>`;
    }

    html += `
      <article class="${classeCarte}">
        <div class="tags">
          <span class="tag">${c.matiereNom}</span>
          <span class="tag">${c.niveauNom}</span>
          ${tagSelection}
        </div>
        <h3>${c.titre}</h3>
        <ul class="infos">
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            ${c.creneau}
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></svg>
            ${textePlaces(c.places)}
          </li>
        </ul>
        <div class="bas">
          <p class="prix">${c.prix} MAD / mois</p>
          ${bouton}
        </div>
      </article>
    `;
  }

  conteneurCartes.innerHTML = html;
  compteur.textContent = texteCompteur(liste.length);

  if (liste.length === 0) {
    aucunResultat.style.display = "";
  } else {
    aucunResultat.style.display = "none";
  }
}

function filtrer() {
  const niveau = filtreNiveau.value;
  const matiere = filtreMatiere.value;

  const resultat = cours.filter(function (c) {
    const bonNiveau = niveau === "" || c.niveau === niveau;
    const bonneMatiere = matiere === "" || c.matiere === matiere;
    return bonNiveau && bonneMatiere;
  });

  afficherCours(resultat);
}

function afficherSelection() {
  let html = "";
  let total = 0;

  for (const c of selection) {
    html += `
      <li class="selection-ligne">
        <div>
          <p class="selection-titre">${c.titre}</p>
          <p class="selection-detail">${c.niveauNom} · ${c.prix} MAD / mois</p>
        </div>
        <button class="btn-retirer" type="button" data-id="${c.id}">Retirer</button>
      </li>
    `;
    total = total + c.prix;
  }

  selectionListe.innerHTML = html;
  selectionNombre.textContent = selection.length + " cours";
  selectionMontant.textContent = total + " MAD / mois";
  rappelValeur.textContent = selection.length + " cours · " + total + " MAD / mois";

  if (selection.length === 0) {
    selectionVide.style.display = "";
    selectionListe.style.display = "none";
    selectionTotal.style.display = "none";
    btnContinuer.style.display = "none";
  } else {
    selectionVide.style.display = "none";
    selectionListe.style.display = "";
    selectionTotal.style.display = "";
    btnContinuer.style.display = "";
  }
}

filtreNiveau.addEventListener("change", filtrer);
filtreMatiere.addEventListener("change", filtrer);

afficherCours(cours);
afficherSelection();

conteneurCartes.addEventListener("click", function (event) {
  const bouton = event.target.closest(".btn");
  if (bouton === null) {
    return;
  }

  const id = Number(bouton.dataset.id);
  const coursChoisi = cours.find(function (c) {
    return c.id === id;
  });

  const dejaChoisi = selection.some(function (c) {
    return c.id === id;
  });

  if (dejaChoisi) {
    return;
  }

  selection.push(coursChoisi);
  afficherSelection();
  filtrer();
});

selectionListe.addEventListener("click", function (event) {
  const bouton = event.target.closest(".btn-retirer");
  if (bouton === null) {
    return;
  }

  const id = Number(bouton.dataset.id);
  selection = selection.filter(function (c) {
    return c.id !== id;
  });

  afficherSelection();
  filtrer();
});

// ===== Formulaire =====

// Étape 1 : les règles de validation
const regexNom = /^[A-Za-zÀ-ÿ'-]+(\s+[A-Za-zÀ-ÿ'-]+)+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTel = /^(0|\+212)[67]\d{8}$/;
const regexLettres = /^[A-Za-zÀ-ÿ'\s-]+$/;
const regexMdp = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Étape 2 : l'affichage des états (erreur / succès)
function afficherErreur(champ, texte) {
  const bloc = champ.closest(".champ-form");
  const message = bloc.querySelector(".message");

  bloc.classList.remove("champ-valide");
  bloc.classList.add("champ-erreur");
  champ.setAttribute("aria-invalid", "true");
  message.textContent = texte;
}

function afficherSucces(champ, texte) {
  const bloc = champ.closest(".champ-form");
  const message = bloc.querySelector(".message");

  bloc.classList.remove("champ-erreur");
  bloc.classList.add("champ-valide");
  champ.setAttribute("aria-invalid", "false");
  message.textContent = "✓ " + texte;
}

// Étape 3 : valider le nom du parent et l'email
const champParent = document.querySelector("#parent");
const champEmail = document.querySelector("#email");

function validerParent() {
  const valeur = champParent.value.trim();

  if (valeur === "") {
    afficherErreur(champParent, "Le nom et le prénom sont obligatoires.");
    return false;
  }
  if (!regexLettres.test(valeur)) {
    afficherErreur(champParent, "Utilisez uniquement des lettres.");
    return false;
  }
  if (!regexNom.test(valeur)) {
    afficherErreur(champParent, "Indiquez le nom et le prénom.");
    return false;
  }

  afficherSucces(champParent, "Nom valide.");
  return true;
}

function validerEmail() {
  const valeur = champEmail.value.trim();

  if (valeur === "") {
    afficherErreur(champEmail, "L'email est obligatoire.");
    return false;
  }
  if (!valeur.includes("@")) {
    afficherErreur(champEmail, "Il manque le @.");
    return false;
  }
  if (!regexEmail.test(valeur)) {
    afficherErreur(champEmail, "Vérifiez l'adresse. Exemple : nom@gmail.com");
    return false;
  }

  afficherSucces(champEmail, "Email valide.");
  return true;
}

// Étape 4 : valider le téléphone
const champTel = document.querySelector("#tel");

function texteChiffres(nombre) {
  if (nombre === 1) {
    return "1 chiffre";
  }
  return nombre + " chiffres";
}

function validerTel() {
  const valeur = champTel.value.replace(/[\s.-]/g, "");

  if (valeur === "") {
    afficherErreur(champTel, "Le numéro est obligatoire.");
    return false;
  }
  if (!/^\+?\d+$/.test(valeur)) {
    afficherErreur(champTel, "Utilisez uniquement des chiffres.");
    return false;
  }

  let reste = "";
  if (valeur.startsWith("+212")) {
    reste = valeur.slice(4);
  } else if (valeur.startsWith("0")) {
    reste = valeur.slice(1);
  } else {
    afficherErreur(champTel, "Le numéro doit commencer par 06, 07 ou +212.");
    return false;
  }

  if (reste !== "" && reste[0] !== "6" && reste[0] !== "7") {
    afficherErreur(champTel, "Après le 0 ou le +212, il faut un 6 ou un 7.");
    return false;
  }

  const manque = 9 - reste.length;
  if (manque > 0) {
    afficherErreur(champTel, "Il manque " + texteChiffres(manque) + ".");
    return false;
  }
  if (manque < 0) {
    afficherErreur(champTel, "Il y a " + texteChiffres(-manque) + " en trop.");
    return false;
  }

  if (!regexTel.test(valeur)) {
    afficherErreur(champTel, "Numéro invalide.");
    return false;
  }

  afficherSucces(champTel, "Numéro valide.");
  return true;
}

// Étape 5 : valider pendant la saisie (parent)
champParent.addEventListener("input", validerParent);
champEmail.addEventListener("input", validerEmail);
champTel.addEventListener("input", validerTel);

champParent.addEventListener("blur", validerParent);
champEmail.addEventListener("blur", validerEmail);
champTel.addEventListener("blur", validerTel);

// Étape 6 : valider l'élève
const champPrenom = document.querySelector("#prenom");
const champNiveau = document.querySelector("#niveau");

function validerPrenom() {
  const valeur = champPrenom.value.trim();

  if (valeur === "") {
    afficherErreur(champPrenom, "Le prénom de l'élève est obligatoire.");
    return false;
  }
  if (!regexLettres.test(valeur)) {
    afficherErreur(champPrenom, "Utilisez uniquement des lettres.");
    return false;
  }
  if (valeur.length < 2) {
    afficherErreur(champPrenom, "Le prénom est trop court.");
    return false;
  }

  afficherSucces(champPrenom, "Prénom valide.");
  return true;
}

function validerNiveau() {
  if (champNiveau.value === "") {
    afficherErreur(champNiveau, "Choisissez le niveau de l'élève.");
    return false;
  }

  afficherSucces(champNiveau, "Niveau choisi.");
  return true;
}

champPrenom.addEventListener("input", validerPrenom);
champPrenom.addEventListener("blur", validerPrenom);

champNiveau.addEventListener("change", validerNiveau);
champNiveau.addEventListener("blur", validerNiveau);

// Étape 7 : le mot de passe et sa confirmation
const champMdp = document.querySelector("#mdp");
const champMdp2 = document.querySelector("#mdp2");
const reglesMdp = document.querySelectorAll(".regles li");

const testsMdp = {
  longueur: /.{8,}/,
  majuscule: /[A-Z]/,
  chiffre: /\d/,
  special: /[^A-Za-z0-9]/
};

const textesManquants = {
  longueur: "au moins 8 caractères",
  majuscule: "une majuscule",
  chiffre: "un chiffre",
  special: "un caractère spécial"
};

function validerMdp() {
  const valeur = champMdp.value;
  const manquants = [];

  for (const li of reglesMdp) {
    const regle = li.dataset.regle;
    const texte = li.textContent.slice(2);

    if (testsMdp[regle].test(valeur)) {
      li.classList.add("regle-ok");
      li.textContent = "✓ " + texte;
    } else {
      li.classList.remove("regle-ok");
      li.textContent = "○ " + texte;
      manquants.push(textesManquants[regle]);
    }
  }

  if (valeur === "") {
    afficherErreur(champMdp, "Le mot de passe est obligatoire.");
    return false;
  }
  if (manquants.length > 0) {
    afficherErreur(champMdp, "Il manque : " + manquants.join(", ") + ".");
    return false;
  }
  if (!regexMdp.test(valeur)) {
    afficherErreur(champMdp, "Mot de passe invalide.");
    return false;
  }

  afficherSucces(champMdp, "Mot de passe sécurisé.");
  return true;
}

function validerMdp2() {
  const valeur = champMdp2.value;

  if (valeur === "") {
    afficherErreur(champMdp2, "Confirmez le mot de passe.");
    return false;
  }
  if (valeur !== champMdp.value) {
    afficherErreur(champMdp2, "Les deux mots de passe ne correspondent pas.");
    return false;
  }

  afficherSucces(champMdp2, "Les mots de passe correspondent.");
  return true;
}

champMdp.addEventListener("input", function () {
  validerMdp();
  if (champMdp2.value !== "") {
    validerMdp2();
  }
});
champMdp.addEventListener("blur", validerMdp);

champMdp2.addEventListener("input", validerMdp2);
champMdp2.addEventListener("blur", validerMdp2);
// Étape 8 : afficher / masquer le mot de passe
const btnAfficher = document.querySelector(".btn-afficher");

btnAfficher.addEventListener("click", function () {
  if (champMdp.type === "password") {
    champMdp.type = "text";
    btnAfficher.textContent = "Masquer";
    btnAfficher.setAttribute("aria-pressed", "true");
  } else {
    champMdp.type = "password";
    btnAfficher.textContent = "Afficher";
    btnAfficher.setAttribute("aria-pressed", "false");
  }
});
// Étape 9 : le consentement
const champConsent = document.querySelector("#consent");

function validerConsent() {
  if (!champConsent.checked) {
    afficherErreur(champConsent, "Cochez cette case pour envoyer le dossier.");
    return false;
  }

  afficherSucces(champConsent, "Consentement donné.");
  return true;
}

champConsent.addEventListener("change", validerConsent);