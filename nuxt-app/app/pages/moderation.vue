<script lang="ts" setup>
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.moderation.title')}`,
  })
</script>

<template>
  <div class="wrapper">
    <h1>{{ $t('pages.moderation.title') }}</h1>
    <p>{{ $t('pages.moderation.p1') }}</p>
    <p>{{ $t('pages.moderation.p2') }}</p>
    <p>{{ $t('pages.moderation.p3') }}</p>
    <p>{{ $t('pages.moderation.p4') }}</p>
    <p>{{ $t('pages.moderation.p5') }}</p>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }
</style>
