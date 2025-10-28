<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    {{ $t('components.menu.actions.label') }}
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
    color: var(--color-beige);

    & > a {
      display: flex;
      gap: var(--space-2xs);
      align-items: center;
    }
  }
</style>
