<script lang="ts" setup>
  import { useField } from 'vee-validate'

  type InputType = 'text' | 'email' | 'password' | 'number'

  const props = defineProps<{
    name: string
    type: InputType
    label: string
    description?: string
    placeholder: string
    required: boolean
  }>()

  const { value, errorMessage } = useField(() => props.name)
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
        />

        <div class="text-input foreground" />
        <div class="text-input background" />
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
    width: 100%;
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
  }

  label {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  input {
    z-index: 3;
    grid-area: stack;
    padding: var(--space-s);
    font-family: var(--font-link);
    font-size: var(--step-0);
    outline: none;
    background: unset;
    border: none;
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

    &::placeholder {
      font-size: var(--step-0);
      color: var(--color-grey);
    }
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
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }
</style>
