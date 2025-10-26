<script setup lang="ts"></script>

<template>
  <div class="hero">
    <slot name="image"></slot>
    <slot name="titleBlock"></slot>
  </div>
</template>

<style scoped>
  .hero {
    display: grid;
    width: 100%;

    & > :nth-child(1) {
      z-index: 1;
      grid-row: 1 / 7;
      grid-column: 1 / 1;
      height: 600px;
    }

    & > :nth-child(2) {
      position: relative;
      z-index: 2;
      grid-row: 6 / 8;
      grid-column: 1 / 1;
      width: 100%;
      max-width: 700px;
    }
  }
</style>
