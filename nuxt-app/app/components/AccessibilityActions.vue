<script setup lang="ts">
  import { useForm, useField } from 'vee-validate'
  import { useAccessibility } from '~/composables/useAccessibility'

  const { largeFontEnabled, toggleLargeFont } = useAccessibility()

  // Create a form context
  useForm()

  const { value } = useField('fontSize', undefined, {
    initialValue: largeFontEnabled.value,
  })

  // Sync field value with shared state when field changes
  watch(value, (newValue) => {
    toggleLargeFont(!!newValue)
  })

  // Sync field value when shared state changes (from other instance)
  watch(largeFontEnabled, (newValue) => {
    if (value.value !== newValue) {
      value.value = newValue
    }
  })
</script>

<template>
  <div class="wrapper">
    <BaseCheckbox
      name="fontSize"
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
