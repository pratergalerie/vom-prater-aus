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
    <Menu />
    <main>
      <slot />
      <CutoutsBackground />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
  .layout-wrapper {
    height: 100%;
  }

  main {
    position: relative;
    max-width: var(--max-width);
    padding: 6rem 0;
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
