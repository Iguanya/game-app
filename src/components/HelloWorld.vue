<script setup>
import { ref } from 'vue'
import { moveCharacter } from '/src/main.js' // Import the handleMovement function from main.js

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <div class="image">
    <img src="../assets/vue.svg" />
  </div>
  <h1>Profile</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      <span>Cash</span>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>

    <!-- Buttons for character movements -->
    <div>
      <button @click="moveCharacter('forward')">Forward</button>
      <button @click="moveCharacter('backward')">Backward</button>
      <button @click="moveCharacter('left')">Left</button>
      <button @click="moveCharacter('right')">Right</button>
    </div>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
