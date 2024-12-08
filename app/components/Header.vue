<script setup lang="ts"></script>

<template>
  <header>
    <Logo />
  </header>
</template>

<style scoped>
  header {
    position: fixed;
    z-index: 99;
    box-sizing: border-box;
    width: 100%;
    height: var(--header-height);
    padding: var(--padding);
  }
</style>
