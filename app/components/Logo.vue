<script setup lang="ts"></script>

<template>
  <div class="vpa-logo">
    <NuxtImg
      :src="'logos/vom-prater-aus.svg'"
      alt="Vom Prater Aus logo"
      class="logo"
    />
    <div class="logotype">
      <span>Vom</span>
      <span>Prater</span>
      <span>Aus</span>
    </div>
  </div>
</template>

<style scoped>
  .vpa-logo {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 150px;
    height: auto;
  }

  .logo {
    width: 100%;
    max-width: 100px;
    height: auto;
  }

  .logotype {
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    justify-content: center;
    width: 56%;
    font-family: Helvetica, sans-serif;
    font-size: 1.2rem;
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
