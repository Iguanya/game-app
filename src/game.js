import { moveCharacter } from './moveCharacter.js';

export class Game {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.animations = ["Pointing", "Walking"];
    this.init();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 4, -8); // Raise the camera a bit higher

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xA3A3A3);
    this.scene.fog = new THREE.Fog(0xA3A3A3, 1000, 2000);

    const light = new THREE.HemisphereLight(0xFFFFFF, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(200, 200, 200);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: true }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    const grid = new THREE.GridHelper(300, 20, 0, 0);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);

    this.loadModels();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 20;
    this.controls.target.set(0, 2, 0); // Initial target
    this.controls.update();

    window.addEventListener('resize', () => this.resize(), false);
    this.animate();
  }

  loadModels() {
    const self = this;

    if (typeof THREE.GLTFLoader !== 'undefined' && typeof THREE.FBXLoader !== 'undefined') {
      const gltfLoader = new THREE.GLTFLoader().setPath('./gltf');
      gltfLoader.load('/buildings.glb', (gltf) => {
        const gltfMesh = gltf.scene;
        gltfMesh.position.set(0, -1, -1);
        gltfMesh.scale.set(2, 2, 2);
        gltfMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });
        self.scene.add(gltfMesh);
      });

      const fbxLoader = new THREE.FBXLoader();
      fbxLoader.load('/FireFighter.fbx', (fbx) => {
        const fbxMesh = fbx;
        fbxMesh.position.set(0, 1, 0); // Raise the character higher from the ground
        fbxMesh.scale.set(0.1, 0.1, 0.1);
        fbxMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });
        self.scene.add(fbxMesh);

        const tloader = new THREE.TextureLoader();
        tloader.load('/FireFighter.png', (texture) => {
          fbxMesh.traverse((child) => {
            if (child.isMesh) child.material.map = texture;
          });
        });

        self.mixer = new THREE.AnimationMixer(fbxMesh);
        self.actions = [];
        self.loadNextAnim(fbxLoader);
      });

      const characterLoader = new THREE.GLTFLoader().setPath('./gltf');
      characterLoader.load('/MultiUVTest.glb', (gltf) => {
        const characterMesh = gltf.scene;
        characterMesh.position.set(0, 1, 0); // Raise the character higher from the ground
        self.scene.add(characterMesh);

        self.characterMesh = characterMesh;
        self.controls.target.copy(self.characterMesh.position); // Set the initial target to the character's position
        document.addEventListener('keydown', (event) => self.handleKeyDown(event));
      });
    } else {
      console.error("Loaders are not defined.");
    }
  }

  loadNextAnim(loader) {
    const anim = this.animations.pop();
    const self = this;

    loader.load(`/models/${anim}.fbx`, (object) => {
      const action = self.mixer.clipAction(object.animations[0]);
      self.actions.push(action);

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      self.scene.add(object);

      if (self.animations.length > 0) {
        self.loadNextAnim(loader);
      } else {
        self.animate();
      }
    });
  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
        moveCharacter(this.characterMesh, 'forward', this.camera);
        break;
      case 'ArrowDown':
        moveCharacter(this.characterMesh, 'backward', this.camera);
        break;
      case 'ArrowLeft':
        moveCharacter(this.characterMesh, 'left', this.camera);
        break;
      case 'ArrowRight':
        moveCharacter(this.characterMesh, 'right', this.camera);
        break;
      default:
        break;
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    // Update the camera position to follow the character smoothly
    if (this.characterMesh) {
      const characterPosition = new THREE.Vector3();
      this.characterMesh.getWorldPosition(characterPosition);
      this.controls.target.copy(characterPosition); // Update the controls target to the character's position
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.controls.dispose();
    this.scene = null;
    this.camera = null;
  }
}
