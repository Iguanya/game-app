import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Constants
const MOVEMENT_SPEED = 0.4;

// Three.js setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xa0a0a0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 2, 15);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.1;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const grid = new THREE.GridHelper(300, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(200, 200, 200);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

let gltfMesh;
let characterMesh; // Variable to hold the first-person character mesh

const loader = new GLTFLoader().setPath('./gltf');
loader.load('/buildings.glb', (gltf) => {
    gltfMesh = gltf.scene;
    gltfMesh.position.set(0, -1, -1);
    gltfMesh.scale.set(2, 2, 2);
    gltfMesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
        }
    });
    scene.add(gltfMesh);
});

const characterLoader = new GLTFLoader().setPath('./gltf');
characterLoader.load('/MultiUVTest.glb', (gltf) => {
    characterMesh = gltf.scene;
    characterMesh.position.set(0, 4, 0);
    scene.add(characterMesh);

    // Add method to characterMesh to update camera position
    characterMesh.updateCameraPosition = function() {
        const distance = 15; // Distance between camera and character
        const height = 2; // Height of the camera above the character

        const characterPosition = characterMesh.position.clone();
        const cameraOffset = new THREE.Vector3(0, height, distance);
        const cameraPosition = characterPosition.clone().add(cameraOffset);

        camera.position.copy(cameraPosition);
        camera.lookAt(characterPosition);
    };
});

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
            moveCharacter('forward');
            break;
        case 'ArrowDown':
            moveCharacter('backward');
            break;
        case 'ArrowLeft':
            moveCharacter('left');
            break;
        case 'ArrowRight':
            moveCharacter('right');
            break;
        default:
            break;
    }
}

export function moveCharacter(direction) {
    if (!gltfMesh || !characterMesh) return;

    switch (direction) {
        case 'forward':
            characterMesh.position.z -= MOVEMENT_SPEED;
            break;
        case 'backward':
            characterMesh.position.z += MOVEMENT_SPEED;
            break;
        case 'left':
            characterMesh.position.x -= MOVEMENT_SPEED;
            break;
        case 'right':
            characterMesh.position.x += MOVEMENT_SPEED;
            break;
        default:
            break;
    }

    characterMesh.updateCameraPosition(); // Update camera position
    updateControlsTarget(characterMesh.position);
}

function updateControlsTarget(position) {
    controls.target.copy(position);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

const mountApplication = () => {
    const appDiv = document.querySelector("#app");
    const vueInstance = createApp(App);

    const renderCanvas = document.createElement("canvas");
    renderCanvas.className = "webgl-canvas";
    appDiv.appendChild(renderCanvas);
    vueInstance.provide("renderCanvas", renderCanvas);
    vueInstance.mount(appDiv);
};

mountApplication();
