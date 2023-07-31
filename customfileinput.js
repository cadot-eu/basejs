// Sélectionner tous les éléments ayant la classe 'custom-file input'
var customFileInputs = document.querySelectorAll('.custom-file input');

// Ajouter un gestionnaire d'événement 'change' à chaque élément sélectionné
customFileInputs.forEach(function (input) {
    input.addEventListener('change', function (e) {
        var files = [];
        for (var i = 0; i < this.files.length; i++) {
            files.push(this.files[i].name);
        }
        // Sélectionner l'élément suivant avec la classe 'custom-file-label'
        var customFileLabel = this.nextElementSibling;
        // Modifier le contenu de l'élément sélectionné avec les noms des fichiers joints
        customFileLabel.innerHTML = files.join(', ');
    });
});
