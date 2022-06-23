//code qui gère l'affichage sur le cercueil en 3D

//modele sur blender créer l'uvmap sur une image blanche
//exporter l'uv map, et par copie d'écran remplir et modifier sur gimp
//sauvegarder en fond.png
//exporter en obj en cercueil_complet.obj

// import '../styles/app.scss';
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
require("jquery-ui/ui/widgets/draggable");

/* -------------------------------------------------------------------------- */
/*                                  variable                                  */
/* -------------------------------------------------------------------------- */
let container;
let camera, cameraTarget, scene, renderer, sizex, sizey;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let cercueil;
let MoveX = 0;
let MoveY = 0;
let targetRotationOnPointerDownX = 0;
let targetRotationOnPointerDownY = 0;
let pointerX = 0;
let pointerY = 0;
let pointerXOnPointerDown = 0;
let pointerYOnPointerDown = 0;
var objLoader_cote;
var Tcote;
var texture_width;
var texture_height;

/* -------------------------------------------------------------------------- */
/*                       on attend la présence du canvas                      */
/* -------------------------------------------------------------------------- */
var checkExist = setInterval(function () {
    if ($("#canvas").length) {
        /* -------------------------------------------------------------------------- */
        /*                             ajout de la texture                            */
        /* -------------------------------------------------------------------------- */
        if (GetURLParameter("modele") != "undefined") {
            Tcote = $("#texture_cote").val();
        }
        $("body").append("<img id='hiddenImage' src='" + Tcote + "' />");
        var texture_width = $("#hiddenImage").width();
        var texture_height = $("#hiddenImage").height();
        $("#hiddenImage").remove();

        /* -------------------------------------------------------------------------- */
        /*                                    main                                    */
        /* -------------------------------------------------------------------------- */
        init();
        animate();
        clearInterval(checkExist);
    }
}, 100); // check every 100ms

/* -------------------------------------------------------------------------- */
/*                           initailisation de tree                           */
/* -------------------------------------------------------------------------- */
function init() {
    /* ------------------------- paramètres de la scène ------------------------- */
    container = document.createElement("div");
    document.getElementById("scene").appendChild(container);
    sizex = $("#scene").width();
    sizey = $("#scene").height();
    camera = new THREE.PerspectiveCamera(10, sizex / sizey, 1, 2000);
    camera.position.z = 750;
    camera.position.y = 350;
    camera.position.x = 350;
    cameraTarget = new THREE.Vector3(0, 32, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    const center = new THREE.AxesHelper(5);
    scene.add(center);

    objLoader_cote = new OBJLoader();

    /* -------- //creation du canvas pour créer la texture pour les cotés ------- */
    //var checkExist = setInterval(function () {
    //if ($("#container").height() > 0) {

    majtexture();
    //    clearInterval(checkExist);
    //  }
    //}, 100); // check every 100ms

    document.getElementById("container").addEventListener("mouseup", (e) => {
        majtexture();
    });
    function majtexture() {
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d");
        /* ------------------------- //on cré le canvas context qui va servir pour la texture ------------------------- */
        var fond = new Image();
        fond.src = Tcote;
        canvas.width = $("#container").width();
        canvas.height = $("#container").height();
        context.drawImage(fond, 0, 0);
        var basetop = 0;
        var width = document.getElementById("container").offsetWidth; //includes margin,border,padding
        var rapportx = canvas.width / width;

        /* -------------- //on ajoute les images du canvas à la texture ------------- */
        $(".objetadd").each(function () {
            var image_fichier = document.createElement("img");
            image_fichier.src = $(this).children("img").attr("src");
            /* --------------------- on applique les transformations -------------------- */
            var transform = window.getComputedStyle(this).transform;
            var rotate = getCurrentRotation(this);
            var matrix = new DOMMatrix(transform);
            //vue de cote
            context.save();
            context.translate(
                matrix.m41 * rapportx + $(this).children("img").width() / 2,
                matrix.m42 * rapportx + $(this).children("img").height() / 2 + basetop
            );
            context.rotate((Math.PI / 180) * rotate);
            context.translate(
                -matrix.m41 * rapportx - $(this).children("img").width() / 2,
                -matrix.m42 * rapportx - $(this).children("img").height() / 2 - basetop
            );
            context.drawImage(
                image_fichier,
                matrix.m41 * rapportx,
                matrix.m42 * rapportx + basetop,
                $(this).children("img").width(),
                $(this).children("img").height()
            );
            context.restore();

            basetop = basetop + $(this).children("img").height();
        });
        //création de la texture à base du canvas
        var texturec = new THREE.CanvasTexture(canvas);
        var texturec = new THREE.Texture(canvas);
        texturec.needsUpdate = true;
        // transformation du canvas en dataurl pour permettre l'enregistrement dans un fichier pour l'export
        //à faire en php pour éviter envoie sur le serveur.
        //var dataURL = canvas.toDataURL({ pixelRatio: 1 }); //qualité de la sortie
        //downloadURI(dataURL, 'stage.png'); //téléchargement
        // on charge l'objet 3D
        //var objLoader = new OBJLoader();
        //on applique la texture
        objLoader_cote.load(
            "/build/3D/cercueil_complet.obj",
            function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texturec;
                    }
                });
                scene.remove(cercueil);
                cercueil = object;
                scene.add(object);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            // called when loading has errors
            function (error) {
                console.log("An error happened");
            }
        );
    }

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizex, sizey);
    container.appendChild(renderer.domElement);

    //document.addEventListener('mousemove', onDocumentMouseMove);
    container.addEventListener("pointerdown", onPointerDown);

    window.addEventListener("resize", onWindowResize);
}
function onWindowResize() {
    sizex = $("#scene").width();
    sizey = $("#scene").height();
    camera.aspect = sizex / sizey;
    camera.updateProjectionMatrix();

    renderer.setSize(sizex, sizey);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}

function onPointerDown(event) {
    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    pointerYOnPointerDown = event.clientY - windowHalfY;
    targetRotationOnPointerDownX = MoveX;
    targetRotationOnPointerDownY = MoveY;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(event) {
    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;
    pointerY = event.clientY - windowHalfY;

    MoveX = targetRotationOnPointerDownX + (pointerX - pointerXOnPointerDown);
    MoveY = targetRotationOnPointerDownY + (pointerY - pointerYOnPointerDown);
    //console.log(photo)
}

function onPointerUp() {
    if (event.isPrimary === false) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.lookAt(cameraTarget);
    if (cercueil) {
        cercueil.rotation.y = MoveX * 0.01;
    }
    renderer.render(scene, camera);
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
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
