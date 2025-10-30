<script setup lang="ts">
  defineProps<{ layout: 'image' | 'text' }>()
</script>

<template>
  <div
    :class="{
      hero: true,
      'image-layout': layout === 'image',
      'text-layout': layout === 'text',
    }"
  >
    <slot name="cover"></slot>
    <slot name="titleBlock"></slot>
  </div>
</template>

<style scoped>
  .hero {
    display: grid;
    width: 100%;

    &.text-layout {
      & > :nth-child(1) {
        place-self: center;
        max-width: 700px;
      }
    }

    &.image-layout {
      & > :nth-child(1) {
        z-index: 1;
        grid-row: 1 / 8;
        grid-column: 1 / 1;
        height: 600px;
      }

      & > :nth-child(2) {
        position: relative;
        z-index: 2;
        grid-row: 7 / 10;
        grid-column: 1 / 1;
        width: 100%;
        max-width: 700px;
      }
    }
  }
</style>
