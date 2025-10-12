<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      name: string
      id: string
      selected?: boolean
    }>(),
    {
      selected: false,
    }
  )

  const emit = defineEmits<{
    (e: 'click', id: string, selected: boolean): void
  }>()

  function handleClick() {
    emit('click', props.name, props.selected)
  }

  const buttonRef = useTemplateRef('buttonRef')

  watch(
    () => props.selected,
    () => {
      // Remove focus from the button if not selected
      if (buttonRef.value) {
        buttonRef.value.blur()
      }
    }
  )
</script>

<template>
  <button
    ref="buttonRef"
    class="keyword highlight"
    :class="{ selected: selected }"
    @click="handleClick"
  >
    <span class="keyword-text">{{ name }}</span>
  </button>
</template>

<style scoped>
  .keyword {
    --color-highlight: var(--color-grey-light);

    padding: 0.25rem 0.75rem;
    font-family: var(--font-button);
    font-size: 0.8rem;
    color: var(--color-text);
    cursor: pointer;
    border: none;
    transition: background 0.2s ease-in-out;

    &:hover,
    &:focus {
      --color-highlight: var(--color-mustard);
    }

    @media screen and (prefers-reduced-motion: reduce) {
      padding: 0.25rem 0.75rem;
      font-family: var(--font-button);
      font-size: 0.8rem;
      color: var(--color-text);
      cursor: pointer;
      border: none;
      border-radius: 1rem;
      transition: none;

      &:hover,
      &:focus {
        --color-highlight: var(--color-mustard);
      }
    }

    &.selected {
      --color-highlight: var(--color-mustard);
    }
  }

  .keyword-text {
    text-wrap: nowrap;
    pointer-events: none;
    user-select: none;
  }
</style>
