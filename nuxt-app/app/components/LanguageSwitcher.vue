<script setup lang="ts">
  const { locale: currentLocale, setLocale } = useI18n({ useScope: 'global' })
</script>

<template>
  <div
    class="lang-switcher"
    aria-label="Language switcher"
  >
    {{ $t('components.languageSwitcher.label') }}
    <a
      href="#"
      :class="{
        active: 'de' === currentLocale,
        highlight: 'de' === currentLocale,
      }"
      @click.prevent.stop="setLocale('de')"
    >
      {{ $t('components.languageSwitcher.german') }}
    </a>
    <a
      href="#"
      :class="{
        active: 'en' === currentLocale,
        highlight: 'en' === currentLocale,
      }"
      @click.prevent.stop="setLocale('en')"
    >
      {{ $t('components.languageSwitcher.english') }}
    </a>
  </div>
</template>

<style scoped>
  .lang-switcher {
    display: flex;
    gap: var(--space-s);
    align-items: center;
    color: var(--color-beige);

    a {
      font-size: inherit;
      text-decoration: none;
      cursor: pointer;

      &.active {
        font-weight: 700;
        color: var(--color-black);
      }
    }
  }
</style>
