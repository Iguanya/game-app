import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { Game } from './game.js'; // Ensure the path is correct

// Constants
export const MOVEMENT_SPEED = 0.8;
const MOUSE_SENSITIVITY = 0.02;

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
};

const loadThreeJS = async () => {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js');
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
    mountApplication();
  } catch (error) {
    console.error(error);
  }
};

const mountApplication = () => {
  const appDiv = document.querySelector("#app");
  const vueInstance = createApp(App);
  vueInstance.mount(appDiv);

  document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    document.body.appendChild(gameContainer);
    new Game(gameContainer);
  });
};

loadThreeJS();
