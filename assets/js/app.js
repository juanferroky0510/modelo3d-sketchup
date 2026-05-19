// assets/js/app.js

import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { VRButton } from 'three/addons/webxr/VRButton.js';


// ESCENA
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x202020);


// CAMARA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 5);


// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.shadowMap.enabled = true;

renderer.xr.enabled = true;


// AGREGAR CANVAS
document
    .getElementById("container3D")
    .appendChild(renderer.domElement);


// BOTON VR
document.body.appendChild(
    VRButton.createButton(renderer)
);


// CONTROLES
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;


// LUCES
const ambientLight =
    new THREE.AmbientLight(0xffffff, 1.5);

scene.add(ambientLight);


const directionalLight =
    new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 7);

directionalLight.castShadow = true;

scene.add(directionalLight);


// PISO
const floorGeometry =
    new THREE.PlaneGeometry(50, 50);

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x555555
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x = -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);


// GRID
const grid =
    new THREE.GridHelper(50, 50);

scene.add(grid);


// CARGAR MODELO
const loader = new GLTFLoader();

loader.load(

    './models/aula y8.glb',

    function (gltf) {

        const model = gltf.scene;

        model.scale.set(1, 1, 1);

        model.position.set(0, 0, 0);

        model.traverse((node) => {

            if (node.isMesh) {

                node.castShadow = true;
                node.receiveShadow = true;

            }

        });

        scene.add(model);

        console.log("Modelo cargado");

    },

    function (xhr) {

        console.log(
            (xhr.loaded / xhr.total * 100)
            + '% cargado'
        );

    },

    function (error) {

        console.error(error);

    }

);


// ANIMACION
function animate() {

    controls.update();

    renderer.render(scene, camera);

}


// LOOP
renderer.setAnimationLoop(animate);


// RESPONSIVE
window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});