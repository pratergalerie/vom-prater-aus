<script setup lang="ts"></script>

<template>
  <NuxtLink
    class="logo"
    to="/"
  >
    <NuxtImg
      src="logos/vom-prater-aus.svg"
      alt="Vom Prater Aus logo"
      class="logo-image"
    />
  </NuxtLink>
</template>

<style scoped>
  .logo {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--header-height);
    height: 100%;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: none;
    border: 0;
    filter: drop-shadow(0 0 10px var(--color-beige));

    @media (min-width: 1024px) {
      margin-left: max(
        calc(50% - 500px + var(--padding-desktop)),
        var(--padding-desktop)
      );
    }
  }

  .logo-image {
    width: auto;
    height: 100%;
    object-fit: contain;
  }
</style>
