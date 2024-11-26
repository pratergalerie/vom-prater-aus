<script setup lang="ts">
  const { isOpen } = storeToRefs(useMenuStore())

  // Setup body scroll lock when menu is open
  watch(isOpen, (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })
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
    <Transition name="fade">
      <main
        v-if="!isOpen"
        class="main"
      >
        <slot />
      </main>
    </Transition>
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

  /* fade */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>
