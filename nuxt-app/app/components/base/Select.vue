<script setup lang="ts">
  type Option = {
    label: string
    value: string | number
  }

  const props = defineProps<{
    id: string
    label?: string
    placeholder?: string
    validationKey?: keyof typeof validationRules
    options: Option[]
    modelValue?: string | number
  }>()

  const value = defineModel<string | number>()

  const error = ref<string | null>(null)

  const emit = defineEmits<{
    (e: 'update:error', value: string | null): void
  }>()

  function handleChange(event: Event) {
    const select = event.target as HTMLSelectElement
    const selectedValue = select.value
    value.value = selectedValue

    if (props.validationKey) {
      error.value = validateField(
        selectedValue,
        validationRules[props.validationKey]
      )
      emit('update:error', error.value)
    }
  }

  watch(value, (newValue) => {
    if (props.validationKey) {
      error.value = validateField(
        newValue?.toString() || '',
        validationRules[props.validationKey]
      )
      emit('update:error', error.value)
    }
  })
</script>

<template>
  <label :for="id">
    <span v-if="label">{{ label }}</span>

    <div class="select-wrapper">
      <select
        :id="id"
        :value="value"
        :class="{ error }"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @change="handleChange"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          selected
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        v-if="error"
        :id="`${id}-error`"
        class="error-message"
        role="alert"
      >
        {{ error }}
      </div>
      <div class="select-shape foreground" />
      <div class="select-shape background" />
    </div>
  </label>
</template>

<style scoped>
  .select-wrapper {
    position: relative;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;
  }

  select {
    z-index: 3;
    grid-area: stack;
    width: 100%;
    padding: var(--space-xs);
    padding-right: 35px;
    font-family: var(--font-link);
    /* stylelint-disable-next-line */
    font-size: var(--step---1);
    color: var(--color-black);
    appearance: none;
    cursor: pointer;
    outline: none;
    background: unset;
    border: none;
  }

  .foreground {
    z-index: 2;
    grid-area: stack;
    background-color: var(--color-white);
    clip-path: polygon(
      0% 10%,
      12.22% 5.3%,
      21.5% 10.87%,
      53.76% 8.25%,
      98.35% 0%,
      98.64% 76.25%,
      97.26% 89.26%,
      88.2% 82.2%,
      83.73% 91.73%,
      70.85% 94.85%,
      61.69% 78.69%,
      53.76% 93.76%,
      26.98% 92.98%,
      1.26% 89.26%,
      0% 73.2%,
      0% 100%
    );
  }

  .background {
    position: relative;
    top: 5px;
    left: -5px;
    z-index: 1;
    grid-area: stack;
    background-color: var(--color-black);
    clip-path: polygon(
      0% 10%,
      12.22% 5.3%,
      21.5% 10.87%,
      53.76% 8.25%,
      98.35% 0%,
      98.64% 76.25%,
      97.26% 89.26%,
      88.2% 82.2%,
      83.73% 91.73%,
      70.85% 94.85%,
      61.69% 78.69%,
      53.76% 93.76%,
      26.98% 92.98%,
      1.26% 89.26%,
      0% 73.2%,
      0% 100%
    );
  }

  .error-message {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--color-red);
  }

  select.error {
    color: var(--color-red);
  }

  /* Custom dropdown arrow */
  .select-wrapper::after {
    position: absolute;
    top: 50%;
    right: 15px;
    z-index: 4;
    width: 0;
    height: 0;
    pointer-events: none;
    content: '';
    border-top: 5px solid var(--color-black);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    transform: translateY(-50%);
  }

  select:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
