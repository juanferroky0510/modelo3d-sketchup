// assets/js/app.js

import * as THREE from 'three';



import { GLTFLoader }
from 'three/addons/loaders/GLTFLoader.js';

import { StereoEffect }
from 'three/addons/effects/StereoEffect.js';


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

camera.position.set(0, 1.7, 5);

// ROTACION TELEFONO

let deviceAlpha = 0;
let deviceBeta = 0;
let deviceGamma = 0;


// LEER SENSORES
window.addEventListener(
    'deviceorientation',
    (event) => {

        deviceAlpha =
            event.alpha || 0;

        deviceBeta =
            event.beta || 0;

        deviceGamma =
            event.gamma || 0;

    }
);


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

document
    .getElementById("container3D")
    .appendChild(renderer.domElement);


// EFECTO VR DIVIDIDO
const effect = new StereoEffect(renderer);

effect.setSize(
    window.innerWidth,
    window.innerHeight
);





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

    }

);


// ======================
// TELEPORT VR
// ======================

const raycaster = new THREE.Raycaster();

const center = new THREE.Vector2(0, 0);

let teleportPoint = null;

let gazeStart = null;

const gazeTime = 2000;


// PUNTO CENTRAL
const reticleGeometry =
    new THREE.RingGeometry(
        0.01,
        0.02,
        32
    );

const reticleMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

const reticle =
    new THREE.Mesh(
        reticleGeometry,
        reticleMaterial
    );

reticle.position.z = -2;

camera.add(reticle);

scene.add(camera);



function updateCameraRotation() {

    // ROTACION Y
    camera.rotation.y =
        THREE.MathUtils.degToRad(
            -deviceAlpha
        );

    // ROTACION X
    camera.rotation.x =
        THREE.MathUtils.degToRad(
            deviceBeta - 90
        );

}

// ANIMACION
function animate() {

    

    updateCameraRotation();
    // RAYCAST
    raycaster.setFromCamera(
        center,
        camera
    );

    const intersects =
        raycaster.intersectObject(floor);


    // SI ESTA MIRANDO EL PISO
    if (intersects.length > 0) {

        teleportPoint =
            intersects[0].point;


        // EMPEZAR CONTADOR
        if (!gazeStart) {

            gazeStart = Date.now();

        }


        // TELEPORT
        if (
            Date.now() - gazeStart
            > gazeTime
        ) {

            camera.position.set(
                teleportPoint.x,
                1.7,
                teleportPoint.z
            );

            gazeStart = null;

        }

    }
    else {

        gazeStart = null;

    }


    // RENDER VR
    effect.render(
        scene,
        camera
    );

}


// LOOP
renderer.setAnimationLoop(animate);


// RESPONSIVE
window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    effect.setSize(
        window.innerWidth,
        window.innerHeight
    );

});



// ACTIVAR SENSORES IOS
window.addEventListener(
    'click',
    () => {

        if (
            typeof DeviceOrientationEvent !==
            'undefined'
            &&
            typeof DeviceOrientationEvent
                .requestPermission ===
            'function'
        ) {

            DeviceOrientationEvent
                .requestPermission()
                .then(response => {

                    console.log(response);

                });

        }

    },
    { once: true }
);