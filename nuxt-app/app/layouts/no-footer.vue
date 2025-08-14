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
  <div class="layout-container">
    <Header />

    <Menu />
    <MenuToggle />

    <Transition name="fade">
      <main
        v-if="!isOpen"
        class="main"
      >
        <slot />
      </main>
    </Transition>
    <CutoutsBackground />
  </div>
</template>

<style scoped>
  .layout-container {
    overflow: hidden;
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
