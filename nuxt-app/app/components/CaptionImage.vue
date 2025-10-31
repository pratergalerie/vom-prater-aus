<script setup lang="ts">
  defineProps<{ caption: string; src: string; alt: string }>()
</script>

<template>
  <div class="image-caption">
    <NuxtPicture
      :src
      :alt
    />
    {{ caption }}
  </div>
</template>

<style scoped>
  .image-caption {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    width: 100%;
    margin-block-end: var(--space-xs);
  }
</style>
