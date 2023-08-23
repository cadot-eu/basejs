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
            onAfterFn: handleClick,

        },
        remove: {
            prototype:
                '<button class="__class__" data-entry-action="remove">__label__</button>',
            class: 'btn btn-danger btn-sm col-2 ms-auto',
            label: 'Surpprimer',
            customFn: null,
            onAfterFn: handleClick
        }
    },
})
/**
 * ajoute le nom du fichier après l'input
 * si c'est une image on ajoute une miniature
 */
document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class 'ex_valeurs_fichiers'
    var ex_valeurs_fichiers = document.querySelectorAll('.ex_valeurs_fichiers');

    // Iterate over each item
    ex_valeurs_fichiers.forEach(function (item) {
        // Get the 'champ' attribute value
        var champ = item.getAttribute('champ');
        // Get the value of the item
        var fichier = item.value;
        // Get the input element with the matching 'champ' attribute value
        var input = document.querySelector('[id="' + champ + '"]');
        // Create a new div element
        var div = document.createElement('div');

        // Check if the file is an image (jpeg, jpg, gif, png)
        if (fichier.match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
            // Add 'col-sm-2' class to the div
            div.classList.add('col-sm-2');
            // Remove 'col-sm-10' class from the input's parent node and add 'col-sm-6' class
            input.parentNode.classList.remove('col-sm-10');
            input.parentNode.classList.add('col-sm-6');
            // Set the div's inner HTML to display the image with a maximum width and height of 100px
            div.innerHTML = '<img data-controller="base--bigpicture"  src="/' + fichier + '" style="max-width: 100px; max-height: 100px;" />';
            // Append the div to the parent node of the input's parent node
            input.parentNode.parentNode.append(div);
        }
        else if (fichier.match(/\.(mp4)$/) != null) {
            // Add 'col-sm-2' class to the div
            div.classList.add('col-sm-2');
            // Remove 'col-sm-10' class from the input's parent node and add 'col-sm-6' class
            input.parentNode.classList.remove('col-sm-10');
            input.parentNode.classList.add('col-sm-6');
            // Set the div's inner HTML to display the video
            div.innerHTML = '<video controls style="width: auto; max-height: 100px;" src="/' + fichier + '"></video>';
            // Append the div to the parent node of the input's parent node
            input.parentNode.parentNode.append(div);
        }
        else {
            // Set the div's inner HTML to display the file value
            div.innerHTML = fichier;
            // Insert the div after the input element
            input.parentNode.insertBefore(div, input.nextSibling);
        }
    });
});

// Fonction à exécuter lors du clic sur le bouton avec l'attribut data-entry-action
function handleClick() {
    // on prend le div avec l'attribut data-prototype==this.prototype
    var divs = document.querySelectorAll('div[data-prototype]');
    //on prend le row juste après ce div
    // Parcourir chaque div
    divs.forEach(function (div) {
        // Récupérer l'ID du div
        var id = div.getAttribute('id');
        var bouton = div.querySelector('button[data-entry-action="add"]')
        // Vérifier si un input caché avec l'ID + "_max" existe dans le document
        var inputMax = document.querySelector('input[type="hidden"][id="' + id + '_max"]');
        if (inputMax) {
            //on veut le nombre de childnodes de div
            if ((div.childNodes.length) > inputMax.value) { //on retire le bouton add
                //on cache le bouton add
                bouton.style.display = 'none';
                //on ajoute un message pour dire que le nombre maximal est atteint juste sous le bouton
                //création d'un paragraphe s'il n'existe pas
                if (!document.querySelector('#' + id + "_alert")) {
                    var p = document.createElement('p');
                    p.innerHTML = 'Le nombre maximal est atteint';
                    //on ajoute une class alert de bootstrap
                    p.classList.add('alert', 'alert-warning');
                    p.id = id + "_alert";
                    //on l'ajoute avant le bouton 
                    bouton.parentNode.parentNode.appendChild(p);
                    //on ajoute un <hr>
                    var hr = document.createElement('hr');
                    bouton.parentNode.parentNode.appendChild(hr);
                }

            }
            else {
                bouton.style.display = 'block';
                //on supprime le message qui a une class alert après le bouton
                if (document.querySelector('#' + id + "_alert"))
                    document.querySelector('#' + id + "_alert").remove();

            }
        }
    });
}

