// Ici je met le background de la page en rouge
window.document.body.style.backgroundColor = 'red';

// Ici je créer un élement Titre (h1)
const monTitreElt = window.document.createElement('h1');

// Icije lui donne une valeur (le text)
monTitreElt.innerText = "Mon titre"

// Ici j'ajoute le titre dans le body de ma page html
window.document.body.appendChild(monTitreElt);