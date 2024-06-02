import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/loaders/GLTFLoader.js',
      'libs/FBXLoader.js',
      'three/examples/jsm/controls/OrbitControls.js'
    ]
  }
});
