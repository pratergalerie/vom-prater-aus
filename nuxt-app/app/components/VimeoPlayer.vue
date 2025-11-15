<script setup lang="ts">
  defineProps<{
    id: number
  }>()
</script>

<template>
  <ScriptVimeoPlayer
    :id="id"
    class="vimeo-player"
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
