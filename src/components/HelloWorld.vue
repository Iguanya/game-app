<template>
  <div class="profile">
    <div class="image">
      <img src="../assets/vue.svg" />
    </div>
    <h1>Profile</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        <span>Cash</span>
        Edit
        <code>components/Profile.vue</code> to test HMR
      </p>
      <div>
        <button @click="moveCharacter('forward')">Forward</button>
        <button @click="moveCharacter('backward')">Backward</button>
        <button @click="moveCharacter('left')">Left</button>
        <button @click="moveCharacter('right')">Right</button>
      </div>
    </div>
  </div>
  <div ref="threeContainer" id="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { moveCharacter } from '../moveCharacter.js';
import { Game } from '../game.js'; // Ensure the path is correct

export default {
  setup() {
    const count = ref(0);
    const threeContainer = ref(null);
    let game;

    onMounted(() => {
      if (typeof THREE !== 'undefined') {
        game = new Game(threeContainer.value);
        window.game = game; // Optional, for debugging
      } else {
        console.error("THREE.js is not loaded.");
      }
    });

    onUnmounted(() => {
      if (game) game.dispose();
    });

    return {
      count,
      moveCharacter,
      threeContainer,
    };
  },
};
</script>

<style scoped>
#three-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.profile {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}
</style>
