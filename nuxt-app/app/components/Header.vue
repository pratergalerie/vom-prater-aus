<script setup lang="ts"></script>

<template>
  <div class="header-wrapper">
    <header>
      <Logo />
      <MenuToggle />
    </header>
  </div>
</template>

<style scoped>
  .header-wrapper {
    position: sticky;
    top: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
    width: 100%;
    height: var(--header-height);
    background-color: var(--color-beige);
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 76.25%,
      97.26% 89.26%,
      88.2% 73.2%,
      83.73% 91.73%,
      77.69% 78.69%,
      70.85% 94.85%,
      61.69% 78.69%,
      53.76% 93.76%,
      43.98% 76.98%,
      36.05% 92.05%,
      26.98% 92.98%,
      23.99% 95.99%,
      15.61% 80.61%,
      1.26% 89.26%,
      0% 73.2%,
      0% 100%
    );
  }

  header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: var(--max-width);
    padding: 0 var(--space-s-m);

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background: url('@/assets/svgs/noise.svg');
      mix-blend-mode: multiply;
    }
  }
</style>
