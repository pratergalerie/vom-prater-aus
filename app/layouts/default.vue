<script setup lang="ts">
  const { isOpen } = storeToRefs(useMenuStore())
</script>

<template>
  <div class="layout-container">
    <Header class="header" />
    <Transition name="slide">
      <Menu
        v-if="isOpen"
        :class="{ open: isOpen }"
        class="menu"
      />
    </Transition>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
  .layout-container {
    display: grid;
    grid-template-areas: 'header' 'main';
    grid-template-rows: var(--header-height) 1fr;
  }

  main {
    grid-area: main;
  }

  .header {
    position: fixed;
    top: 0;
    z-index: 3;
    grid-area: header;
  }

  .menu {
    grid-area: main;
  }

  /* slide right to left */
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  .slide-enter-to,
  .slide-leave-from {
    transform: translateX(0);
  }
</style>
