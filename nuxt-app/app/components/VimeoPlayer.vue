<script setup lang="ts">
  defineProps<{
    id: number
    aboveTheFold?: boolean
  }>()
</script>

<template>
  <ScriptVimeoPlayer
    :id="id"
    class="vimeo-player"
    :above-the-fold
  />
</template>

<style scoped>
  .vimeo-player {
    position: relative;
    width: 100%;
    min-width: 300px;
    aspect-ratio: 16/9;
  }
</style>
