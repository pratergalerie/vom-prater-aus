<script lang="ts" setup>
  type InputType = 'text' | 'email' | 'password' | 'number'

  const props = defineProps<{
    id: string
    type: InputType
    label?: string
    placeholder?: string
    validationKey?: keyof typeof validationRules
  }>()

  const value = defineModel({
    type: String,
    default: '',
  })

  const error = ref<string | null>(null)

  const emit = defineEmits<{
    (e: 'update:error', value: string | null): void
  }>()

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement
    if (!props.validationKey) return

    const rules = validationRules[props.validationKey]
    let sanitizedValue = sanitizeInput(input.value, rules.allowedChars)

    // Explicitly remove spaces for email fields
    if (props.type === 'email') {
      sanitizedValue = sanitizedValue.replace(/\s+/g, '')
    }

    if (sanitizedValue !== input.value) {
      input.value = sanitizedValue
      value.value = sanitizedValue
    }

    error.value = validateField(sanitizedValue, rules)
    emit('update:error', error.value)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (props.type === 'email' && event.key === ' ') {
      event.preventDefault()
    }
  }

  watch(value, (newValue) => {
    if (props.validationKey) {
      error.value = validateField(
        newValue,
        validationRules[props.validationKey]
      )
      emit('update:error', error.value)
    }
  })
</script>

<template>
  <div>
    <label :for="id">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <input
        :id="id"
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :class="{ error: error }"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="handleInput"
        @keydown="handleKeyDown"
      />
      <div
        v-if="error"
        :id="`${id}-error`"
        class="error-message"
        role="alert"
      >
        {{ error }}
      </div>
      <div class="text-input foreground" />
      <div class="text-input background" />
    </div>
  </div>
</template>

<style scoped>
  .input-wrapper {
    position: relative;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;
  }

  input {
    z-index: 3;
    grid-area: stack;
    padding: var(--space-xs);
    font-family: var(--font-link);
    /* stylelint-disable-next-line */
    font-size: var(--step---1);
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

  input.error {
    color: var(--color-red);
  }
</style>
