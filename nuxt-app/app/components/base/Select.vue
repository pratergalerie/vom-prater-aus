<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      description?: string
      placeholder: string
      required: boolean
    }>(),
    { description: undefined }
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

      <div class="select-wrapper">
        <select
          :id="name"
          v-model="value"
          :name="name"
          :class="{ errorMessage }"
          :style="{
            color: value === '' ? 'var(--color-grey)' : undefined,
          }"
          @focus="isFocused = true"
          @blur="isFocused = false"
        >
          <option
            value=""
            disabled
          >
            {{ placeholder }}
          </option>
          <slot name="options"></slot>
        </select>
        <div class="select-shape foreground" />
        <div class="select-border" />
        <div class="select-shape background" />
      </div>
    </label>

    <div
      v-if="errorMessage"
      class="error error-message"
    >
      {{ $t(errorMessage) }}
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    z-index: 700;
  }

  .label-description {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);

    & span {
      font-weight: 600;
    }
  }

  .select-wrapper {
    position: relative;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;
    place-items: center center;
    filter: drop-shadow(-6px 6px 0 var(--color-black));
  }

  label {
    display: grid;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  select {
    z-index: 4;
    grid-area: stack;
    width: 100%;
    padding: var(--space-s);
    padding-right: 35px;
    font-family: var(--font-link);
    font-size: var(--step-0);
    color: var(--color-black);
    appearance: none;
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;
  }

  .foreground {
    z-index: 3;
    grid-area: stack;
    width: 100%;
    height: 100%;
    background-color: var(--color-white);
    clip-path: v-bind(cutoutShape);
  }

  .select-border {
    z-index: 2;
    grid-area: stack;
    width: calc(100% + v-bind(borderSize) * 2);
    height: calc(100% + v-bind(borderSize) * 2);
    background-color: v-bind(borderColor);
    clip-path: v-bind(cutoutShape);
  }

  .background {
    position: relative;
    top: 5px;
    left: -5px;
    z-index: 1;
    grid-area: stack;
    background-color: var(--color-black);
    clip-path: v-bind(cutoutShape);
  }

  .error-message {
    padding: var(--space-2xs) 0;
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }

  /* Custom dropdown arrow */
  .select-wrapper::after {
    position: absolute;
    top: 50%;
    right: 20px;
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
</style>
