import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xa0a0a0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 2, 15); // Adjusted camera position for zooming in

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false; // Changed to autoRotate for rotation control
controls.autoRotateSpeed = 0.1; // Adjusted rotation speed
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Add ground
const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const grid = new THREE.GridHelper(300, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// Add directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 200, 100);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Load GLTF model
const loader = new GLTFLoader().setPath('./gltf');
loader.load('/shack.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 1, -1);
    mesh.scale.set(1, 1, 1);
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        }
    });
    //scene.add(mesh);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls in animation loop
    renderer.render(scene, camera);
}

animate();

const mountApplication = () => {
    const appDiv = document.querySelector("#app");
    const vueInstance = createApp(App);

    // Initiate and register renderer canvas as a Vue slot
    const renderCanvas = document.createElement("canvas");
    renderCanvas.className = "webgl-canvas";
    appDiv.appendChild(renderCanvas);
    vueInstance.provide("renderCanvas", renderCanvas);

    // Render the Vue app and mount it
    vueInstance.mount(appDiv);
};

// Mount Vue app after Three.js setup
mountApplication();
