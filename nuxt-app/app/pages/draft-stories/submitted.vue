<script lang="ts" setup></script>

<template>
  <div class="wrapper">
    <h1>{{ $t('pages.stories.submitted.title') }}</h1>
    <p>{{ $t('pages.stories.submitted.text') }}</p>
    <BaseButton
      variant="primary"
      layout="label"
      href="/stories"
      :label="$t('pages.stories.submitted.button')"
    />
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    padding-top: 50px;
  }
</style>
