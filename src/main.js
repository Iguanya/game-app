import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Constants
const MOVEMENT_SPEED = 0.8;
const MOUSE_SENSITIVITY = 0.02;

// Three.js setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xa0a0a0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 0); // Adjust camera position to be on top of the character

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.target.set(0, 2, 0);
controls.update();

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: true }));
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
let characterMesh;

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
    characterMesh.position.set(0, 0, 0); // Adjusted initial position to be on top of the ground mesh
    scene.add(characterMesh);

    // Mount camera on top of the character
    characterMesh.add(camera);
    camera.position.set(0, 2, 0); // Adjust camera position relative to character
});

document.addEventListener('keydown', handleKeyDown);

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

    // Get the character's forward and right vectors based on its orientation
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(characterMesh.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(characterMesh.quaternion);

    switch (direction) {
        case 'forward':
            characterMesh.position.add(forward.clone().multiplyScalar(MOVEMENT_SPEED)); // Move forward along the character's facing direction
            break;
        case 'backward':
            characterMesh.position.add(forward.clone().multiplyScalar(-MOVEMENT_SPEED)); // Move backward opposite to the character's facing direction
            break;
        case 'left':
            characterMesh.position.add(right.clone().multiplyScalar(-MOVEMENT_SPEED)); // Move left relative to the character's facing direction
            break;
        case 'right':
            characterMesh.position.add(right.clone().multiplyScalar(MOVEMENT_SPEED)); // Move right relative to the character's facing direction
            break;
        default:
            break;
    }
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
