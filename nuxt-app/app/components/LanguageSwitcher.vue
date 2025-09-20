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
      href="#"
      :class="{
        active: 'de' === currentLocale,
        highlight: 'de' === currentLocale,
      }"
      @click.prevent.stop="setLocale('de')"
    >
      DE
    </a>
    <a
      href="#"
      :class="{
        active: 'en' === currentLocale,
        highlight: 'en' === currentLocale,
      }"
      @click.prevent.stop="setLocale('en')"
    >
      EN
    </a>
  </div>
</template>

<style scoped>
  .lang-switcher {
    display: flex;
    gap: 1rem;
    align-items: center;
    color: var(--color-beige);

    a {
      font-size: inherit;
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
