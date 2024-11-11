<script setup lang="ts"></script>

<template>
  <button class="logo">
    <NuxtImg
      :src="'logos/vom-prater-aus.svg'"
      alt="Vom Prater Aus logo"
      class="logo-image"
    />
    <div class="logotype">
      <span>Vom</span>
      <span>Prater</span>
      <span>Aus</span>
    </div>
  </button>
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

    /* Add drop shadow */
    filter: drop-shadow(0 1rem 1rem rgb(244 238 217 / 100%));
    border: 0;
  }

  .logo-image {
    width: 100%;
    max-width: 60%;
    height: auto;
  }

  .logotype {
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    justify-content: center;
    width: 56%;
    font-family: Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.1rem;

    span:nth-child(1) {
      align-self: flex-end;
      padding-right: 1rem;
    }

    span:nth-child(3) {
      align-self: flex-end;
    }
  }
</style>
