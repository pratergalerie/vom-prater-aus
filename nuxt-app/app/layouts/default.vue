<script setup lang="ts">
  const { isOpen } = useMenu()

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
  <div class="layout-wrapper">
    <Header />
    <main>
      <slot />
    </main>
    <Menu />
    <CutoutsBackground />
    <Footer />
  </div>
</template>

<style scoped>
  .layout-wrapper {
    position: relative;
    display: grid;
    grid-template-rows: max-content 1fr max-content;
    grid-template-columns: 100%;
    min-height: 100vh;
    overflow: clip;
  }

  main {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--max-width);
    padding: var(--space-2xl-3xl) var(--space-s-m);
    padding-top: var(--space-s-m);
    margin: 0 auto;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s;

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
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

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
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
