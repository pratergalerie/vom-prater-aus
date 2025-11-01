<script lang="ts" setup>
  const { t } = useI18n()

  useHead({
    title: t('pages.stories.deleted.title'),
  })
</script>

<template>
  <div class="wrapper">
    <h1>{{ $t('pages.stories.deleted.title') }}</h1>
    <p>{{ $t('pages.stories.deleted.text') }}</p>
    <BaseButton
      variant="primary"
      layout="label"
      href="/"
      :label="$t('pages.stories.deleted.button')"
    />
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    align-items: flex-start;
  }
</style>
