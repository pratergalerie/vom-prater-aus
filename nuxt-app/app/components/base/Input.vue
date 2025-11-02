<script lang="ts" setup>
  import { useField } from 'vee-validate'

  type InputType = 'text' | 'email' | 'password' | 'number'

  const props = withDefaults(
    defineProps<{
      name: string
      type: InputType
      label: string
      description?: string
      placeholder?: string
      required?: boolean
    }>(),
    { description: undefined, required: false, placeholder: '' }
  )

  const { value, errorMessage } = useField(() => props.name)

  const isFocused = ref(false)

  const borderSize = '3px'
  const borderColor = computed(() =>
    isFocused.value ? 'var(--color-cerulean)' : 'transparent'
  )

  const cutoutShape = ref('')

  onMounted(() => {
    cutoutShape.value = `polygon(
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
    )`
  })
</script>

<template>
  <div class="wrapper">
    <label :for="name">
      <div class="label-description">
        <span>{{ label }}{{ required ? '*' : '' }}</span>
        <p v-if="description">{{ description }}</p>
      </div>

      <div class="input-wrapper">
        <input
          v-if="type !== 'number'"
          :id="name"
          v-model="value"
          :name="name"
          :type="type"
          :placeholder="placeholder"
          :class="{ error: errorMessage }"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <input
          v-else
          :id="name"
          v-model="value"
          inputmode="numeric"
          :name="name"
          type="text"
          :placeholder="placeholder"
          :class="{ error: errorMessage }"
          pattern="[0-9]*"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />

        <div class="foreground" />
        <div class="input-border" />
      </div>
    </label>

    <span
      v-if="errorMessage"
      class="error error-message"
    >
      {{ $t(errorMessage) }}
    </span>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .label-description {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);

    & span {
      font-weight: 600;
    }
  }

  .input-wrapper {
    position: relative;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;
    place-items: center center;
    filter: drop-shadow(-6px 6px 0 var(--color-black));
  }

  label {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  input {
    z-index: 4;
    box-sizing: border-box;
    grid-area: stack;
    width: 100%;
    padding: var(--space-s);
    font-family: var(--font-link);
    font-size: var(--step-0);
    outline: none;
    background: transparent;
    border: none;

    /* Remove auto-fill styling */
    &:-webkit-autofill {
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-background-clip: text;
    }

    &::placeholder {
      font-size: var(--step-0);
      color: var(--color-grey);
    }
  }

  .foreground {
    z-index: 3;
    grid-area: stack;
    width: 100%;
    height: 100%;
    background-color: var(--color-white);
    clip-path: v-bind(cutoutShape);
  }

  .input-border {
    z-index: 2;
    grid-area: stack;
    width: calc(100% + v-bind(borderSize) * 2);
    height: calc(100% + v-bind(borderSize) * 2);
    background-color: v-bind(borderColor);
    clip-path: v-bind(cutoutShape);
  }

  .error-message {
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }
</style>
