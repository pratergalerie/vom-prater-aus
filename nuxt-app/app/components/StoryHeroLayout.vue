<script setup lang="ts"></script>

<template>
  <div class="hero">
    <slot
      class="image"
      name="image"
    ></slot>
    <slot
      class="title-block"
      name="titleBlock"
    ></slot>
  </div>
</template>

<style scoped>
  .hero {
    display: grid;
    width: 100%;

    & .image {
      grid-row: 1 / 7;
      grid-column: 1 / 1;
      height: 600px;
    }

    & .title-block {
      position: relative;
      grid-row: 6 / 8;
      grid-column: 1 / 1;
      width: 100%;
      max-width: 600px;
    }
  }
</style>
