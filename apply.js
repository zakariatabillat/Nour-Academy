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