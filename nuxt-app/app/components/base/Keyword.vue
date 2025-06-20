<script lang="ts" setup>
  const props = defineProps<{
    keyword: string
    id: string
  }>()

  const emit = defineEmits<{
    (e: 'click', id: string): void
  }>()

  function handleClick() {
    emit('click', props.id)
  }
</script>

<template>
  <button
    class="keyword highlight"
    @click="handleClick"
  >
    {{ keyword }}
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
        --color-highlight: var(--color-cerulean);
      }
    }
  }
</style>
