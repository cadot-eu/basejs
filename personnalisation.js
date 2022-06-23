/* ------------------------------- libraririe ------------------------------- */
import Moveable from "moveable";
import { Light } from "three";

/* -------------- base pour le cadre de déplacement de moveable ------------- */
const frame = {
    translate: [0, 0],
    scale: [1, 1],
};
/* -------------------------------- variable -------------------------------- */
var base64 = "";
var objet = [];
var num;
var texture_width;
var texture_height;

/* ------------------- on met la bonne taille au plan 2D ------------------ */
const img = new Image();
img.src = $("#texture_cote").val();

img.onload = function () {
    texture_width = img.naturalWidth;
    texture_height = img.naturalHeight;
    /* ------------- on ajuste les tailles du container et du canvas ------------ */
    if ($("#container").width() > texture_width) {
        $("#container").css("height", texture_height);
        $("#container").css("width", texture_width);
    } else {
        $("#container").css(
            "height",
            ($("#divcontainer").width() * texture_height) / texture_width
        );
        $("#container").css("width", $("#divcontainer").width());
    }
    $("#canvas").css("height", $("#container").height());
    $("#canvas").css("width", $("#container").width());
};

/* -------------------------------------------------------------------------- */
/*                           Adaptation D'uploadjs'                           */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                       On Ouvre Une Ancienne Création                       */
/* -------------------------------------------------------------------------- */
if ($("#excreation").val()) {
    $(".excreation_photo").each(function (index, element) {
        base64 = $(this).val();
        num = 100 + index;
        check2("excreation_photo_" + $(this).data("num"));

        /* ------------------------ //on ajoute les fichiers ------------------------ */
        $("#personnalisation_photos_" + index + "_fichier")
            .next()
            .text($(this).data("fichier"));
        var nomhidden = "#personnalisation_photos_" + index + "_fichier";
        $("#personnalisation_photos_" + index + "_fichier").after(
            '<input type="hidden" id="uploadjs¤' +
            nomhidden +
            '" name="uploadjs¤' +
            nomhidden +
            '" value="' +
            $(this).data("fichier") +
            '">'
        );
        /* ------------------------------- //on ajoute ------------------------------ */
        $("fieldset").each(function (index, e) {
            majfieldset(e);
        });
    });
}
/* --------------------- Gestion du bouton envoyer (créer ou éediter) -------------------- */
$("#envoyer").on("click", function () {
    event.preventDefault();
    //on récupère toutes les images et leurs transformation
    $(".objetadd").each(function () {
        var numero = $(this).attr("id").split("_")[2];
        var res = {};
        var res = {
            transform: window.getComputedStyle(this).transform,
            //rotate: getCurrentRotation(this),
            width: window.getComputedStyle(this).width,
            height: window.getComputedStyle(this).height,
        };
        $("#personnalisation_photos_" + numero + "_description").text(
            JSON.stringify(res)
        );
        //console.log(JSON.stringify(res));
    });
    document.forms["personnalisation"].submit();
});
/* -------------------------------------------------------------------------- */
/*                             gestion du moveable                            */
/* -------------------------------------------------------------------------- */
function moveableUpdate(element, objet) {
    objet[num] = new Moveable(document.getElementById("container"), {
        target: element,
        draggable: true,
        scalable: false,
        resizable: true,
        keepRatio: true,
        rotatable: true,
    })
        .on("drag", ({ target, transform }) => {
            target.style.transform = transform;
        })
        .on("scroll", ({ scrollContainer, direction }) => {
            scrollContainer.scrollLeft += direction[0] * 10;
            scrollContainer.scrollTop += direction[1] * 10;
        })
        .on("rotate", ({ target, transform, dist }) => {
            target.style.transform = transform;
        })
        .on("resizeStart", ({ target, set, setOrigin, dragStart }) => {
            // Set origin if transform-origin use %.
            setOrigin(["%", "%"]);
            // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
            const style = window.getComputedStyle(target);
            const cssWidth = parseFloat(style.width);
            const cssHeight = parseFloat(style.height);
            set([cssWidth, cssHeight]);

            // If a drag event has already occurred, there is no dragStart.
            dragStart && dragStart.set(frame.translate);
        })
        .on("resize", ({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        })
        .on("resizeEnd", ({ target, isDrag, clientX, clientY }) => { })
        .on("scaleStart", ({ set, dragStart }) => {
            set(frame.scale);

            // If a drag event has already occurred, there is no dragStart.
            dragStart && dragStart.set(frame.translate);
        })
        .on("scale", ({ target, scale, drag }) => {
            target.style.transform = transform;
        })
        .on("scaleEnd", ({ target, isDrag, clientX, clientY }) => {
            //console.log("onScaleEnd", target, isDrag);
        });
}

/* -------------------------------------------------------------------------- */
/*                         // functions de chargement                         */
/* -------------------------------------------------------------------------- */
//pas utiliser pour les nouvelles créations
function check(nom) {
    var reader = new FileReader();
    reader.readAsDataURL(document.querySelector("#" + nom).files[0]);
    reader.onload = function () {
        base64 = reader.result;
        check2(nom);
    };
    reader.onerror = function (error) {
        console.log("Error: ", error);
    };
}
//utilisé par les anciennes créations et les nouvelles pour créer l'image et la transformer en moveable
function check2(nom) {
    const img = new Image();
    img.src = base64;
    //on retaille la hauteur du cadre de moveable
    img.onload = function () {
        var newheight =
            ((texture_width / 6) * img.naturalheight) / img.naturalWidth;
        var imgnew = $(
            "<div class='objetadd' style='height:" +
            newheight +
            "px;width:" +
            texture_width / 6 +
            "px;' id= 'objet¤" +
            nom +
            "'><img class='img-fluid' src='" +
            base64 +
            "'></div>"
        );
        var data = $(".excreation_photo")[nom.split("_")[2]];
        if ($(data).length > 0)
            $(imgnew)
                .css("transform", $(data).data("transform").transform)
                .css("width", $(data).data("transform").width)
                .css("height", $(data).data("transform").height);
        //on ajoute la nouvelle image au container
        $("#container").append(imgnew);
        //on la transforme en objet moveable
        moveableUpdate(imgnew, objet);
    };
}

function getCurrentRotation(el) {
    var st = window.getComputedStyle(el, null);
    var tm =
        st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
        "none";
    if (tm != "none") {
        var values = tm.split("(")[1].split(")")[0].split(",");
        /*
        a = values[0];
        b = values[1];
        angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
        */
        //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
        var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return angle < 0 ? angle + 360 : angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0;
}
