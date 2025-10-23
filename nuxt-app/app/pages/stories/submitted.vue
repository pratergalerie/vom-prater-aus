<script lang="ts" setup>
  const { t } = useI18n()
</script>

<template>
  <div class="page-container">
    <h1>{{ t('pages.stories.submitted.title') }}</h1>
    <p>{{ t('pages.stories.submitted.text') }}</p>
    <BaseButton
      variant="primary"
      layout="label-icon"
      :href="`/stories/explorer`"
      class="button"
      :label="t('pages.stories.submitted.button')"
      icon="mdi:arrow-right"
    />
  </div>
</template>

<style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: calc(100vh - var(--header-height));
    padding-top: 50px;
    container-name: page-container;
    container-type: inline-size;
  }

  h1 {
    font-size: 1.5rem;
    line-height: 1.8rem;
  }

  p {
    max-width: 600px;

    @container (width < 500px) {
      max-width: 100%;
    }
  }

  .button {
    margin-top: 20px;
  }
</style>
