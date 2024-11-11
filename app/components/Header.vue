<script setup lang="ts">
  const { toggleMenu } = useMenuStore()
</script>

<template>
  <header>
    <Logo @click="toggleMenu" />
  </header>
</template>

<style scoped>
  header {
    box-sizing: border-box;
    width: 100%;
    height: var(--header-height);
    padding: var(--padding);

    /* Gradient background, from top to bottom */
    background: linear-gradient(
      180deg,
      rgb(244 238 217 / 80%) 0%,
      rgb(244 238 217 / 0%) 100%
    );
  }
</style>
