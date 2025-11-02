<script setup lang="ts">
  // Import scroll timeline polyfill (only client-side)
  if (import.meta.client) {
    await import('scroll-timeline-polyfill/dist/scroll-timeline.js')
  }
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
