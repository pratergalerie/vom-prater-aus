<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <BaseCheckbox
      name="termsPrivacy"
      color="white"
    >
      <template #label>
        <span>{{ $t('components.menu.actions.fontSize') }}</span>
      </template>
    </BaseCheckbox>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    gap: var(--space-s);
    align-items: center;
    font-family: var(--font-link);
    color: var(--color-beige);

    @media (max-width: 800px) {
      /* stylelint-disable-next-line custom-property-pattern */
      font-size: var(--step--1);
    }

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    & > a {
      display: flex;
      gap: var(--space-2xs);
      align-items: center;
    }
  }
</style>
