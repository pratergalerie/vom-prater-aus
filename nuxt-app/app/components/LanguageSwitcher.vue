<script setup lang="ts">
  const { locale: currentLocale, setLocale } = useI18n({ useScope: 'global' })
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
    gap: var(--space-xs);
    align-items: center2;
    font-family: var(--font-link);
    color: var(--color-beige);

    @media (max-width: 800px) {
      /* stylelint-disable-next-line custom-property-pattern */
      font-size: var(--step--1);
    }

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
