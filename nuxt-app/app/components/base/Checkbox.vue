<script lang="ts" setup>
  import { useField } from 'vee-validate'

  const props = defineProps<{
    name: string
    required?: boolean
  }>()

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
      53.76% 8.25%,
      98.35% 0%,
      83.73% 91.73%,
      0% 100%
    )`
  })
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
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <div class="checkbox">
        <div class="checkbox-content">
          <Icon
            v-if="value"
            name="mdi:check"
            mode="css"
            class="check-icon"
          />
        </div>
        <div class="checkbox-border"></div>
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
    width: fit-content;
  }

  .checkbox {
    display: grid;
    flex-shrink: 0;
    grid-template: 'stack' 1fr / 1fr;
    place-items: center center;
    width: var(--step-1);
    height: var(--step-1);
    margin-top: 0.35ch;
    filter: drop-shadow(-3px 3px 0 var(--color-black));
    transition: all 0.2s ease-out;

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  label {
    display: flex;
    gap: var(--space-2xs);
    cursor: pointer;

    &:hover .checkbox,
    &:has(input:focus) .checkbox {
      filter: drop-shadow(-4px 4px 0 var(--color-black));
      transform: scale(1.05);
    }
  }

  .checkbox-content {
    z-index: 4;
    display: flex;
    grid-area: stack;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--color-white);
    clip-path: v-bind(cutoutShape);
  }

  .checkbox-border {
    z-index: 3;
    grid-area: stack;
    width: calc(100% + v-bind(borderSize) * 2);
    height: calc(100% + v-bind(borderSize) * 2);
    background-color: v-bind(borderColor);
    clip-path: v-bind(cutoutShape);
  }

  .check-icon {
    width: 100%;
    height: 100%;
    color: var(--color-black);
  }

  .error-message {
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
  }
</style>
