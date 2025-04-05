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
    max-width: 1000px;
    height: var(--header-height);
    padding: var(--padding-mobile);
    margin: 0 auto;

    @media (min-width: 768px) {
      left: 50%;
      padding: var(--padding-mobile) var(--padding-desktop);
      transform: translateX(-50%);
    }
  }
</style>
