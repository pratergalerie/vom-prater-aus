<script lang="ts" setup>
  import { useField } from 'vee-validate'

  const props = defineProps<{
    name: string
    required?: boolean
  }>()

  const { value, errorMessage } = useField(() => props.name)
</script>

<template>
  <div class="wrapper">
    <label :for="name">
      <input
        :id="name"
        v-model="value"
        class="visually-hidden"
        :name="name"
        type="checkbox"
      />
      <div class="checkbox">
        <img
          src="/svgs/inputs/checkbox.svg"
          alt=""
          class="background"
        />
        <img
          v-if="value"
          src="/svgs/inputs/check.svg"
          alt=""
          class="foreground"
        />
      </div>

      <slot name="label"></slot>
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

  label {
    display: flex;
    gap: var(--space-2xs);
    align-items: center;
    width: max-content;
  }

  .checkbox {
    display: grid;
    grid-template-areas: 'stack';
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    & .foreground {
      z-index: -1;
      grid-area: stack;
      transform: translate(6px, -2px);
    }

    & .background {
      z-index: -2;
      grid-area: stack;
    }
  }

  .error-message {
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }
</style>
