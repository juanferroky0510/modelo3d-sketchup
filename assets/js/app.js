import * as THREE from 'three';

import { GLTFLoader }
    from 'three/addons/loaders/GLTFLoader.js';

import { VRButton }
    from 'three/addons/webxr/VRButton.js';


// ======================
// ESCENA
// ======================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x202020);


// ======================
// CAMARA
// ======================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


// ======================
// PLAYER (CUERPO)
// ======================

const player = new THREE.Group();

player.position.set(0, 1.4, 0);

scene.add(player);

player.add(camera);


// ======================
// RENDERER
// ======================

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

renderer.xr.enabled = true;

renderer.shadowMap.enabled = true;

document
    .getElementById("container3D")
    .appendChild(renderer.domElement);


// ======================
// BOTON VR
// ======================

document.body.appendChild(
    VRButton.createButton(renderer)
);


// ======================
// LUCES
// ======================

const ambientLight =
    new THREE.AmbientLight(0xffffff, 1.5);

scene.add(ambientLight);


const directionalLight =
    new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 7);

directionalLight.castShadow = true;

scene.add(directionalLight);


// ======================
// PISO
// ======================

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


// ======================
// GRID
// ======================

const grid =
    new THREE.GridHelper(50, 50);

scene.add(grid);


// ======================
// CARGAR MODELO
// ======================

const loader = new GLTFLoader();

loader.load(

    './models/aula_y8.glb',

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


// ======================
// MOVIMIENTO XBOX
// ======================

const moveSpeed = 0.08;

function updateMovement() {

    const gamepads =
        navigator.getGamepads();

    if (!gamepads) return;

    const gp = gamepads[0];

    if (!gp) return;

    // STICK IZQUIERDO
    const axisX = gp.axes[0];
    const axisY = gp.axes[1];

    // ZONA MUERTA
    const deadZone = 0.15;

    let moveX = 0;
    let moveZ = 0;

    if (Math.abs(axisX) > deadZone) {
        moveX = axisX;
    }

    if (Math.abs(axisY) > deadZone) {
        moveZ = axisY;
    }

    // DIRECCION DE LA CAMARA
    const forward =
        new THREE.Vector3();

    camera.getWorldDirection(forward);

    forward.y = 0;

    forward.normalize();

    // DERECHA
    const right =
        new THREE.Vector3();

    right.crossVectors(
        forward,
        new THREE.Vector3(0, 1, 0)
    );

    // MOVIMIENTO
    player.position.addScaledVector(
        forward,
        -moveZ * moveSpeed
    );

    player.position.addScaledVector(
        right,
        moveX * moveSpeed
    );

}


// ======================
// ANIMACION
// ======================

function animate() {

    updateMovement();

    renderer.render(scene, camera);

}


// ======================
// LOOP
// ======================

renderer.setAnimationLoop(animate);


// ======================
// RESPONSIVE
// ======================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ======================
// BOTON ENTRAR VR
// ======================

const enterVRButton =
    document.getElementById(
        'enterVR'
    );

enterVRButton.addEventListener(
    'click',
    async () => {

        // FULLSCREEN
        await document.body
            .requestFullscreen();

        // IOS
        if(
            typeof DeviceOrientationEvent
            !== 'undefined'
            &&
            typeof DeviceOrientationEvent
                .requestPermission
            === 'function'
        ){

            await DeviceOrientationEvent
                .requestPermission();

        }

        // OCULTAR UI
        document
            .getElementById(
                'overlayUI'
            )
            .style.display = 'none';

    }
);