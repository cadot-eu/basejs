import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
require('jquery-ui/ui/widgets/draggable');




let container;

let camera, cameraTarget, scene, renderer, sizex, sizey;


let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let cercueil, circle, photo;
export default {
    FOO: photo
}
init();
animate();
import bois from '../3D/bois.jpg'
import photoj from '../3D/photo.jpg'
let MoveX = 0;
let MoveY = 0;
let targetRotationOnPointerDownX = 0;
let targetRotationOnPointerDownY = 0;
let pointerX = 0;
let pointerY = 0;
let pointerXOnPointerDown = 0;
let pointerYOnPointerDown = 0;

function init() {

    container = document.createElement('div');
    document.getElementById('scene').appendChild(container);
    sizex = $('#scene').width();
    sizey = $('#scene').height()
    camera = new THREE.PerspectiveCamera(25, sizex / sizey, 1, 2000);
    camera.position.z = 250;
    camera.position.y = 250;
    camera.position.x = 250;
    cameraTarget = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(bois);
    const texturep = textureLoader.load(photoj);

    const center = new THREE.AxesHelper(5);
    scene.add(center);
    var objLoader = new OBJLoader();
    objLoader.load('/build/3D/cercueil.obj', function (objet) {
        objet.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        cercueil = objet
        scene.add(cercueil);
    });

    objLoader.load('/build/3D/circle.obj', function (objet) {
        objet.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        circle = objet
        scene.add(circle);
    });
    objLoader.load('/build/3D/photo.obj', function (objet) {
        objet.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texturep;
            }
        });
        photo = objet

        //photo.position.addVectors(center, new THREE.Vector3(1, 1, 1).multiplyScalar(1));

        scene.add(photo);
    });




    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizex, sizey);
    container.appendChild(renderer.domElement);

    //document.addEventListener('mousemove', onDocumentMouseMove);
    container.addEventListener('pointerdown', onPointerDown);

    window.addEventListener('resize', onWindowResize);



}
function onWindowResize() {
    sizex = $('#scene').width();
    sizey = $('#scene').height()
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

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

}

function onPointerMove(event) {

    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;
    pointerY = event.clientY - windowHalfY;

    MoveX = targetRotationOnPointerDownX + (pointerX - pointerXOnPointerDown);
    MoveY = targetRotationOnPointerDownY + (pointerY - pointerYOnPointerDown);
    console.log(photo)
}

function onPointerUp() {

    if (event.isPrimary === false) return;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);


}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    //camera.position.x += (mouseX * 3 - camera.position.x);
    //camera.position.y += (- mouseY - camera.position.y) * .05;
    //camera.position.x = Math.cos(targetRotation);
    //camera.position.x = Math.cos(targetRotation) * 3;
    //camera.position.x = Math.sin(targetRotation);
    //camera.position.x = 60 * Math.tan(targetRotation * .01);
    //camera.position.y = Math.sin(targetRotation);
    camera.lookAt(cameraTarget);
    if (cercueil && circle && photo) {
        cercueil.rotation.y = MoveX * .01
        circle.rotation.y = MoveX * .01
        photo.rotation.y = MoveX * .01
        // camera.zoom = MoveY * .1
        // camera.updateProjectionMatrix();
    }
    //cercueil.position.x = targetRotation
    renderer.render(scene, camera);

}
