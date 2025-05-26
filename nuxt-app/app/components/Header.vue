<script setup lang="ts"></script>

<template>
  <header>
    <div class="header-container">
      <Logo />
    </div>
  </header>
</template>

<style scoped>
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    box-sizing: border-box;
    width: 100%;
    height: var(--header-height);
    background-color: var(--color-beige);
    mask: url('/svgs/header/masks/mobile.svg');
    mask-repeat: no-repeat;
    mask-composite: exclude;

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
      left: 50%;
      mask: url('/svgs/header/masks/tablet.svg');
      transform: translateX(-50%);
    }

    @media (min-width: 768px) {
      mask: url('/svgs/header/masks/desktop.svg');
    }
  }

  .header-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: var(--max-width);
    height: 100%;
    padding: 0 var(--padding-mobile);
    margin: 0 auto;

    @media (min-width: 500px) {
      padding: 0 var(--padding-tablet);
    }

    @media (min-width: 768px) {
      padding: 0 var(--padding-desktop);
    }
  }
</style>
