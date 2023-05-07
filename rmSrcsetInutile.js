// list les images de la page et retire les srcset inutiles
var images = document.querySelectorAll('img');
images.forEach(function (img) {
    //on récupère la largeur de la fenetre
    var width = window.innerWidth
    //on supprime les srcset dont la taille est supérieure à la largeur de la fenetre
    //on récupère le srcset et on le split pour avoir un tableau
    var srcset = img.getAttribute('srcset');
    if (srcset == null) return;
    pourcentage = 100;
    if (img.getAttribute('data-size') != null)
        if (img.getAttribute('data-size').indexOf('%') != -1) pourcentage = img.getAttribute('data-size').split('%')[0];

    srcset = srcset.split(',');
    //on boucle sur le tableau
    let i;
    for (i = 0; i < srcset.length; i++) {
        //on récupère la taille de l'image
        var size = srcset[i].split(' ')[1];
        //on supprime le w
        size = size.replace('w', '');
        //on supprime les srcset dont la taille est supérieure à la largeur de la fenetre
        if (size > width * (pourcentage / 100)) {
            break;
        }
    }
    //on coupe le tabeau à la position i+1
    srcset = srcset.slice(0, i + 1);
    //on reconstitue le srcset
    img.setAttribute('srcset', srcset.join(','));
});
