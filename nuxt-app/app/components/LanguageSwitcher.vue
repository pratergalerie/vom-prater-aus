<script setup lang="ts">
  const { locale, locales } = useI18n()

  function handleLanguageChange(newLocale: 'en' | 'de') {
    locale.value = newLocale
  }
</script>

<template>
  <div class="language-switcher">
    <button
      v-for="loc in locales"
      :key="loc.code"
      :class="{ active: locale === loc.code }"
      :aria-label="`Switch to ${loc.code === 'en' ? 'English' : 'German'}`"
      @click="handleLanguageChange(loc.code)"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
  .language-switcher {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    background: none;
    border: 1px solid rgb(204 204 204);
    border-radius: 4px;
    transition: all 0.2s ease;

    @media screen and (prefers-reduced-motion: reduce) {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      cursor: pointer;
      background: none;
      border: 1px solid rgb(204 204 204);
      border-radius: 4px;
      transition: none;
    }

    &:hover,
    &:focus {
      background-color: rgb(245 245 245);
    }

    &.active {
      color: white;
      background-color: rgb(74 144 226);
      border-color: rgb(74 144 226);
    }
  }
</style>
