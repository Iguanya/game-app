import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
directionalLight.position.set(0, 200, 100);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

let gltfMesh;

const loader = new GLTFLoader().setPath('./gltf');
loader.load('/shaft2.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 1, -1);
    mesh.scale.set(1, 1, 1);
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
            //child.material = new THREE.MeshPhongMaterial({ color: 0x11ff11, emissive: 0xff336fff });
        }
    });
    scene.add(gltfMesh);
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
    if (!gltfMesh) return;

    switch (direction) {
        case 'forward':
            gltfMesh.position.z -= MOVEMENT_SPEED;
            break;
        case 'backward':
            gltfMesh.position.z += MOVEMENT_SPEED;
            break;
        case 'left':
            gltfMesh.position.x -= MOVEMENT_SPEED;
            break;
        case 'right':
            gltfMesh.position.x += MOVEMENT_SPEED;
            break;
        default:
            break;
    }

    updateCameraPosition(gltfMesh.position);
    updateControlsTarget(gltfMesh.position);
}

function updateCameraPosition(position) {
    camera.position.copy(position.clone().add(new THREE.Vector3(0, 2, 15)));
    camera.lookAt(position);
}

function updateControlsTarget(position) {
    controls.target.copy(position);
}

/* const fbxLoader = new FBXLoader().setPath('./gltf/fbx');
fbxLoader.load('/run.fbx', (object) => {
    object.position.set(0, 0, 0);
    scene.add(object);
}); */

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
