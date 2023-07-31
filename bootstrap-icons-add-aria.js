// Sélectionner tous les éléments <i> dont la classe commence par 'bi-'
var icons = document.querySelectorAll("i[class^='bi-']");

// Parcourir chaque élément sélectionné
icons.forEach(function (icon) {
    let cs;
    // Parcourir les classes de l'élément courant
    icon.classList.forEach(function (element) {
        if (element.slice(0, 3) === 'bi-') {
            cs = element;
            return false; // Quitter la boucle forEach dès qu'on trouve la classe commençant par 'bi-'
        }
    });

    // Définir les attributs 'role' et 'aria-label' pour l'élément courant
    icon.setAttribute('role', 'img');
    icon.setAttribute('aria-label', cs.slice(3).replace('-', ' '));
});
