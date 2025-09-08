<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: t('pages.accessibility.title'),
    meta: [
      {
        name: 'description',
        content: '',
      },
    ],
  })
</script>

<template>
  <section>
    <h1>{{ t('pages.accessibility.title') }}</h1>

    <div class="content">
      <p>
        {{ t('pages.accessibility.description') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }
</style>
