<script setup lang="ts"></script>

<template>
  <div class="overlay" />
  <div class="texture" />
</template>

<style scoped>
  .texture {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    background: url('@/assets/svgs/noise.svg');
    opacity: 1;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: var(--light-beige);
    mix-blend-mode: multiply;
  }
</style>
