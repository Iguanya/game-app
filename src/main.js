import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Prepare renderer, scene, camera, and orbit controls
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xaf7c4f)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 3, 15) // Adjusted camera position for zooming in

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false 
controls.minDistance = 5
controls.maxDistance = 20
controls.minPolarAngle = 0.5
controls.maxPolarAngle = 1.5
controls.autoRotate = false // Changed to autoRotate for rotation control
controls.autoRotateSpeed = 0.1 // Adjusted rotation speed
controls.target = new THREE.Vector3(0, 1, 0)
controls.update()

// Add ground
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
groundGeometry.rotateX(-Math.PI / 2)
const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.receiveShadow = true
scene.add(ground)

// Add directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Load GLTF model
const loader = new GLTFLoader().setPath('./gltf/source')
loader.load('/map.glb', (gltf) => {
    const mesh = gltf.scene
    mesh.position.set(0, 1, -1)
    mesh.scale.set(2, 2, 2)
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        }
    });
    scene.add(mesh)
})

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    controls.update() // Update controls in animation loop
    renderer.render(scene, camera)
}

animate()

const mountApplication = () => {
  const appDiv = document.querySelector("#app")
  const vueInstance = createApp(App)

  // Initiate and register renderer canvas as a Vue slot
  const renderCanvas = document.createElement("canvas")
  renderCanvas.className = "webgl-canvas"
  appDiv.appendChild(renderCanvas)
  vueInstance.provide("renderCanvas", renderCanvas)

  // Render the Vue app and mount it
  vueInstance.mount(appDiv)
}

// Mount Vue app after Three.js setup
mountApplication()