<script setup lang="ts">
  const {
    locale: currentLocale,
    locales,
    setLocale,
  } = useI18n({ useScope: 'global' })
</script>

<template>
  <div
    class="lang-switcher"
    aria-label="Language switcher"
  >
    <a
      v-for="locale in locales"
      :key="locale.code"
      href="#"
      :class="{
        active: locale.code === currentLocale,
        highlight: locale.code === currentLocale,
      }"
      @click.prevent.stop="setLocale(locale.code)"
    >
      {{ locale.code }}
    </a>
  </div>
</template>

<style scoped>
  .lang-switcher {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    color: var(--color-beige);

    a {
      font-size: var(--step-0);
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;

      &.active {
        font-weight: 700;
        color: var(--color-black);
      }
    }
  }
</style>
