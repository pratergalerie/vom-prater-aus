<script setup lang="ts"></script>

<template>
  <header>
    <Logo />
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
    padding: var(--padding-mobile);
    margin: 0 auto;
    background-color: var(--color-beige);
    mask: url('/svgs/header/mask.svg');
    mask-repeat: no-repeat;
    mask-composite: exclude;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: url('@/assets/svgs/noise.svg');
      mix-blend-mode: multiply;
    }

    @media (min-width: 768px) {
      left: 50%;
      padding: var(--padding-mobile) var(--padding-desktop);
      transform: translateX(-50%);
    }
  }
</style>
