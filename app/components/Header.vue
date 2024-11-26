<script setup lang="ts">
  const { toggleMenu } = useMenuStore()

  const logoBackgroundImgSrc = '/svgs/logo-background.svg'
</script>

<template>
  <header>
    <Logo @click="toggleMenu" />
    <div class="logo-background">
      <img
        :src="logoBackgroundImgSrc"
        alt="Logo background"
      />
    </div>
  </header>
</template>

<style scoped>
  header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: var(--header-height);
    padding: var(--padding);
  }

  .logo-background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 50%;
    height: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: auto;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
