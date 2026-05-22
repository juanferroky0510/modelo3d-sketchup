import * as THREE from 'three';

import { GLTFLoader }
    from 'three/addons/loaders/GLTFLoader.js';

import { StereoEffect }
    from 'three/addons/effects/StereoEffect.js';

// ======================
// FORZAR LANDSCAPE
// ======================

async function forceLandscape() {

    try {

        if (screen.orientation) {

            await screen.orientation.lock(
                'landscape'
            );

        }

    }
    catch (error) {

        console.log(
            'Landscape no soportado'
        );

    }

}

forceLandscape();
window.screen.orientation.lock(
    'landscape-primary'
);


// ======================
// ESCENA
// ======================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x202020);


// ======================
// CAMARA
// ======================

const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );

camera.position.set(0, 1.7, 5);

// ======================
// ROTACION TELEFONO
// ======================

let deviceAlpha = 0;
let deviceBeta = 0;
let deviceGamma = 0;


// LEER GIROSCOPIO
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


// ======================
// RENDERER
// ======================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
);

renderer.setPixelRatio(
    window.devicePixelRatio
);
renderer.xr.enabled = false;

document
    .getElementById('container3D')
    .appendChild(renderer.domElement);


// ======================
// VR DIVIDIDO
// ======================

const effect =
    new StereoEffect(renderer);

effect.setSize(
    window.innerWidth,
    window.innerHeight
);


// ======================
// LUCES
// ======================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

directionalLight.position.set(
    5,
    10,
    7
);

scene.add(directionalLight);


// ======================
// PISO
// ======================

const floorGeometry =
    new THREE.PlaneGeometry(
        50,
        50
    );

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x555555
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x =
    -Math.PI / 2;

scene.add(floor);


// ======================
// GRID
// ======================

const grid =
    new THREE.GridHelper(
        50,
        50
    );

scene.add(grid);


// ======================
// MODELO
// ======================

const loader =
    new GLTFLoader();

loader.load(

    './models/aula_y8.glb',

    function (gltf) {

        const model =
            gltf.scene;

        model.scale.set(
            1,
            1,
            1
        );

        scene.add(model);

        console.log(
            'Modelo cargado'
        );

    }

);


// ======================
// MOVIMIENTO
// ======================

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const velocity =
    new THREE.Vector3();

const direction =
    new THREE.Vector3();

const speed = 0.08;


// ======================
// GAMEPAD
// ======================

function updateGamepad() {

    const gamepads =
        navigator.getGamepads();

    if (!gamepads) return;

    const gp = gamepads[0];

    if (!gp) return;


    // JOYSTICK IZQUIERDO
    const lx = gp.axes[0];
    const ly = gp.axes[1];

    moveForward =
        ly < -0.2;

    moveBackward =
        ly > 0.2;

    moveLeft =
        lx < -0.2;

    moveRight =
        lx > 0.2;




}


// ======================
// MOVIMIENTO CAMARA
// ======================

function updateMovement() {

    direction.z =
        Number(moveForward)
        - Number(moveBackward);

    direction.x =
        Number(moveRight)
        - Number(moveLeft);

    direction.normalize();


    // ADELANTE
    if (moveForward || moveBackward) {

        camera.translateZ(
            -direction.z * speed
        );

    }


    // LADOS
    if (moveLeft || moveRight) {

        camera.translateX(
            direction.x * speed
        );

    }

}


// ======================
// PUNTO CENTRAL
// ======================

const dotGeometry =
    new THREE.SphereGeometry(
        0.01
    );

const dotMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

const dot =
    new THREE.Mesh(
        dotGeometry,
        dotMaterial
    );

dot.position.z = -2;

camera.add(dot);

scene.add(camera);


// ======================
// ACTUALIZAR CABEZA VR
// ======================

function updateHeadTracking() {

    const alpha =
        THREE.MathUtils.degToRad(
            deviceAlpha
        );

    const beta =
        THREE.MathUtils.degToRad(
            deviceBeta
        );

    const gamma =
        THREE.MathUtils.degToRad(
            deviceGamma
        );


    // ORIENTACION TELEFONO
    const euler =
        new THREE.Euler(
            beta,
            alpha,
            -gamma,
            'YXZ'
        );

    camera.quaternion
        .setFromEuler(euler);


    // CORRECCION HORIZONTAL VR
    const correctionQuaternion =
        new THREE.Quaternion();

    const correctionAngle =
        THREE.MathUtils.degToRad(-45);

    correctionQuaternion
        .setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            correctionAngle
        );

    camera.quaternion.multiply(
        correctionQuaternion
    );

}


// ======================
// ANIMACION
// ======================

function animate() {

    updateHeadTracking();

    updateGamepad();

    updateMovement();

    effect.render(
        scene,
        camera
    );

}

renderer.setAnimationLoop(
    animate
);


// ======================
// RESPONSIVE
// ======================

window.addEventListener(
    'resize',
    () => {
        window.scrollTo(0, 0);
        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight,
            false
        );

        effect.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);

// ======================
// ACTIVAR SENSORES
// ======================

window.addEventListener(
    'click',
    async () => {

        // FULLSCREEN
        document.body
            .requestFullscreen();

        // IOS
        if (
            typeof DeviceOrientationEvent
            !== 'undefined'
            &&
            typeof DeviceOrientationEvent
                .requestPermission
            === 'function'
        ) {

            await DeviceOrientationEvent
                .requestPermission();

        }

    },
    { once: true }
);