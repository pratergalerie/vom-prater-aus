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

  const footerRef = ref<HTMLElement | null>(null)
  const isFooterVisible = useElementVisibility(footerRef)

  const bottomGradientOpacity = computed(() => {
    return isFooterVisible.value ? 0 : 1
  })
</script>

<template>
  <div class="layout-container">
    <Header />
    <div class="frame">
      <GradientHalftone />
      <GradientHalftone
        direction="bottom"
        class="bottom-gradient"
        :style="{ opacity: bottomGradientOpacity }"
      />
    </div>

    <Menu />

    <Transition name="fade">
      <main
        v-if="!isOpen"
        class="main"
      >
        <slot />
      </main>
    </Transition>
    <Transition name="fade">
      <Footer
        v-if="!isOpen"
        ref="footerRef"
        class="footer"
      />
    </Transition>
  </div>
</template>

<style scoped>
  main {
    margin-top: var(--header-height);
  }

  .footer {
    margin-top: 100px;
  }

  .frame {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
  }

  /* slide right to left */
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
