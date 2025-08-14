<script setup lang="ts"></script>

<template>
  <div class="background"></div>
</template>

<style scoped>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -999;
    display: grid;
    width: 100vw;
    height: 100vh;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: url('@/assets/svgs/noise.svg');
      mix-blend-mode: multiply;
    }
  }
</style>
