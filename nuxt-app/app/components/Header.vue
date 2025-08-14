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
    mask-image: url('/svgs/header/masks/mobile.svg');
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: cover;
    mask-composite: exclude;

    @media (min-width: 500px) {
      mask-image: url('/svgs/header/masks/tablet.svg');
    }

    @media (min-width: 768px) {
      mask-image: url('/svgs/header/masks/desktop.svg');
    }
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: var(--max-width);

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

    @media (min-width: 500px) {
      padding: 0 var(--padding-tablet);
    }

    @media (min-width: 768px) {
      padding: 0 var(--padding-desktop);
    }
  }
</style>
