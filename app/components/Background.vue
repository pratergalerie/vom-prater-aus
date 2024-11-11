<script setup lang="ts"></script>

<template>
  <div class="background">
    <div class="vignette" />
    <div class="overlay" />
    <div class="texture" />
  </div>
</template>

<style scoped>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .texture {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    background: url('@/assets/svgs/noise.svg');
    opacity: 1;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    background: var(--light-beige);
    mix-blend-mode: multiply;
  }

  .vignette {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    box-shadow:
      inset 10px 20px 300px 0 var(--brown),
      inset -10px -20px 300px 0 var(--brown),
      inset 20px -10px 300px 0 var(--brown),
      inset -20px 10px 300px 0 var(--brown);
    mix-blend-mode: color-burn;
    opacity: 0.2;
  }
</style>
