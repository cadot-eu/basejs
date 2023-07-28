import a2lix_lib from '@a2lix/symfony-collection'


a2lix_lib.sfCollection.init({
    collectionsSelector: 'form div[data-prototype]',
    manageRemoveEntry: true,
    entry: {
        add: {
            prototype:
                '<button class="__class__" data-entry-action="add">__label__</button>',
            class: 'btn btn-primary btn-sm mt-2',
            label: 'ajouter',
            customFn: null,
            onBeforeFn: null,
            onAfterFn: null
        },
        remove: {
            prototype:
                '<button class="__class__" data-entry-action="remove">__label__</button>',
            class: 'btn btn-danger btn-sm',
            label: 'Surpprimer',
            customFn: null,
            onAfterFn: null
        }
    },
})
document.addEventListener('DOMContentLoaded', function () {
    var ex_valeurs_fichiers = document.querySelectorAll('.ex_valeurs_fichiers');
    ex_valeurs_fichiers.forEach(function (item) {
        var champ = item.getAttribute('champ');
        var fichier = item.value;
        var input = document.querySelector('[id="' + champ + '"]');

        var div = document.createElement('div');

        //si le fichier est une image on ajoute une miniature
        if (fichier.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            div.classList.add('col-sm-2');
            //dans le input on modifie sa classe col-sm-10 en col-sm-6
            input.parentNode.classList.remove('col-sm-10');
            input.parentNode.classList.add('col-sm-6');
            div.innerHTML = '<img data-controller="base--bigpicture"  src="/' + fichier + '" style="max-width: 100px; max-height: 100px;" />';
            input.parentNode.parentNode.append(div);
        } else {
            div.innerHTML = fichier;
            input.parentNode.insertBefore(div, input.nextSibling);
        }

    });
});