<script setup lang="ts">
  const menuOpen = ref(false)

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }
</script>

<template>
  <header :class="{ open: menuOpen }">
    <Logo @click="toggleMenu" />
    <nav>
      <div class="background" />
      <ul>
        <li>
          <NuxtLink to="/">Main page</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/prater">About Berliner Prater</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/stories">Discover the stories</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/create">Write your story</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About the project</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 120px;
    overflow: hidden;

    &.open {
      height: 100%;
    }
  }

  nav {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--white);

    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      list-style: none;

      li {
        font-family: var(--link-font);
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.5rem;
        color: var(--light-beige);
        text-align: right;
        cursor: pointer;
        transition: color 0.3s;
      }
    }
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: url('/svgs/menu/shapes/main-bg-shape-1.svg');
  }
</style>
