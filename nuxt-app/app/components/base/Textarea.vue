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
    <div>
      <span>{{ label }}{{ required ? '*' : '' }}</span>
      <span
        v-if="errorMessage"
        class="error error-message"
      >
        {{ ' ' }}
        {{ $t(errorMessage) }}
      </span>
    </div>
    <textarea
      :id="name"
      v-model="value"
      :name="name"
    />
  </label>
</template>

<style scoped>
  label {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    width: 100%;
    height: 100%;
    font-weight: 600;
  }

  textarea {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: var(--space-m);
    font-size: var(--step-0);
    resize: vertical;
    border: unset;
  }

  .error-message {
    font-weight: 400;
  }
</style>
