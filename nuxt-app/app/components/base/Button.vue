<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      type?: 'submit' | 'button'
      variant: 'primary' | 'secondary'
      label?: string
      icon?: string
      href?: string | null
      disabled?: boolean
    }>(),
    {
      type: 'button',
      label: undefined,
      icon: undefined,
      href: undefined,
    }
  )

  const borderSize = '5px'
  const shadowOffset = '5px'

  const foregroundColor = computed(() =>
    props.variant === 'primary' ? 'var(--color-black)' : 'var(--color-white)'
  )

  const backgroundColor = computed(() =>
    props.variant === 'primary' ? 'var(--color-white)' : 'var(--color-black)'
  )

  const borderColor = computed(() =>
    props.variant === 'primary' ? 'var(--color-black)' : 'var(--color-black)'
  )

  const shadowColor = computed(() =>
    props.variant === 'primary' ? 'var(--color-black)' : 'var(--color-white)'
  )

  const cutoutShape = ref('')

  onMounted(() => {
    cutoutShape.value = `polygon(
        0% 10%,
        9.22% 5.3%,
        21.5% -0.13%,
        47.76% 3.25%,
        98.35% 4%,
        98.64% 76.25%,
        97.26% 89.26%,
        87.73% 91.73%,
        72.85% 94.85%,
        54.69% 87.69%,
        46.76% 92.76%,
        26.98% 90.98%,
        6.26% 90.26%,
        0% 73.2%,
        0% 100%
      )`
  })
</script>

<template>
  <button
    :type="type"
    :class="{
      primary: variant === 'primary',
      secondary: variant === 'secondary',
      disabled: disabled,
    }"
    :style="{}"
  >
    <div
      class="button-content"
      :style="{ clipPath: cutoutShape }"
    >
      <NuxtLink
        v-if="href && label"
        :to="href"
        >{{ label }}</NuxtLink
      >
      <span v-if="!href && label">{{ label }}</span>
      <Icon
        v-if="icon"
        :name="icon"
        mode="css"
        class="icon"
      />
    </div>
    <div
      class="button-content-border"
      :style="{ clipPath: cutoutShape }"
    ></div>
    <div
      class="button-background"
      :style="{ clipPath: cutoutShape }"
    >
      <div
        class="button-background-border"
        :style="{ clipPath: cutoutShape }"
      ></div>
    </div>
  </button>
</template>

<style scoped>
  .button-content {
    z-index: 4;
    box-sizing: border-box;
    display: flex;
    grid-area: stack;
    gap: var(--space-xs);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: var(--space-xs);
    padding-bottom: var(--space-s);
    background-color: v-bind(backgroundColor);
  }

  .button-content-border {
    z-index: 3;
    grid-area: stack;
    width: calc(100% + v-bind(borderSize));
    height: calc(100% + v-bind(borderSize));
    background-color: v-bind(borderColor);
  }

  .button-background {
    position: relative;
    top: 7px;
    left: -7px;
    z-index: 2;
    grid-area: stack;
    grid-template: 'background-stack' 1fr/1fr;
    place-items: center center;
    width: 100%;
    height: 100%;
    background-color: v-bind(borderColor);
    transition: all 200ms ease-in-out;
  }

  .button-background-border {
    position: relative;
    z-index: 2;
    grid-area: background-stack;
    width: calc(100% - (v-bind(borderSize) / 2));
    height: calc(100% - (v-bind(borderSize) / 2));
    background-color: v-bind(shadowColor);
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  button {
    z-index: 700;
    display: grid;
    grid-template: 'stack' 1fr/1fr;
    place-items: center center;
    max-width: 300px;
    height: 60px;
    color: v-bind(foregroundColor);
    cursor: pointer;
    background: none;
    border: none;
    transition: all 0.2s ease-out;

    &:hover,
    &:focus {
      transform: scale(1.05);

      & .button-background {
        top: calc(v-bind(shadowOffset) * 1.3);
        left: calc(v-bind(shadowOffset) * -1.3);
      }
    }

    &.disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.5;
      filter: none;
      transition: none;
    }

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  a {
    font-weight: 600;
    color: inherit;
    text-decoration: none;
  }
</style>
