import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xaf7c4f)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Set up scene
const scene = new THREE.Scene()

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.set(4, 5, 11)


// Set up controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false 
controls.minDistance = 5
controls.maxDistance = 20
controls.minPolarAngle = 0.5
controls.maxPolarAngle = 1.5
controls.autorotate = false
controls.target = new THREE.Vector3(0, 1, 0)
controls.update()

const geometry = new THREE.BoxGeometry( 2, 2, 2 )
const material = new THREE.MeshBasicMaterial( { color: 0xa1ff00 } )
const cube = new THREE.Mesh( geometry, material )
//scene.add(cube)

// Add ground
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
groundGeometry.rotateX(-Math.PI / 2)
const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
scene.add(ground)

// Add spot light
const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5)
spotLight.position.set(0, 25, 0)
spotLight.intensity = 1
scene.add(spotLight)

// Load GLTF model
const loader = new GLTFLoader().setPath('./gltf/')
loader.load('MultiUVTest.glb', (gltf) => {
    const mesh = gltf.scene
    mesh.position.set(0, 1, -1)
    mesh.scale.set(1, 1, 1)
    scene.add(gltf.scene)
})

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
	//cube.rotation.y += 0.01
    controls.update() // Update controls in animation loop
    renderer.render(scene, camera)
}

animate()
createApp(App).mount('#app')