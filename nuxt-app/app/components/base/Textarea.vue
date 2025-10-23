<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      required?: boolean
    }>(),
    { required: false }
  )

  const { value, errorMessage } = useField<string>(() => props.name)
</script>

<template>
  <label :for="name">
    <span>{{ label }}{{ required ? '*' : '' }}</span>
    <textarea
      :id="name"
      v-model="value"
      :name="name"
    />
  </label>

  <span
    v-if="errorMessage"
    class="error error-message"
  >
    {{ $t(errorMessage) }}
  </span>
</template>

<style scoped>
  label {
    width: 100%;
    max-width: 70ch;
  }

  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 60ch;
    padding: var(--space-m);
    font-size: var(--step-0);
    resize: vertical;
  }

  .error-message {
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }
</style>
