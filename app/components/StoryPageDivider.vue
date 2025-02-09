<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      color:
        | 'mint'
        | 'mustard'
        | 'red'
        | 'brown'
        | 'viridian'
        | 'pink'
        | 'white'
        | 'black'
        | 'grey'
      shapeVariantIndex: number
    }>(),
    {
      color: 'mint',
      shapeVariantIndex: 0,
    }
  )

  const shapeColor = computed(() => {
    return `var(--${props.color})`
  })

  const shapeVariant = computed(() => {
    return `shape-variant-${props.shapeVariantIndex}`
  })
</script>

<template>
  <div
    class="divider noise"
    :class="shapeVariant"
  ></div>
</template>

<style scoped>
  .divider {
    background: v-bind(shapeColor);

    /* stylelint-disable plugins/no-unused-selectors */
    &.shape-variant-0 {
      clip-path: polygon(
        0 15%,
        4% 0,
        15% 12%,
        25% 5%,
        35% 15%,
        48% 3%,
        60% 10%,
        75% 0,
        85% 12%,
        96% 2%,
        100% 15%,
        100% 85%,
        95% 100%,
        85% 88%,
        70% 95%,
        55% 85%,
        40% 97%,
        25% 88%,
        15% 100%,
        5% 90%,
        0 85%
      );
    }

    &.shape-variant-1 {
      clip-path: polygon(
        0 15%,
        4% 0,
        15% 12%,
        25% 5%,
        35% 15%,
        48% 3%,
        60% 10%,
        75% 0,
        85% 12%,
        96% 2%,
        100% 15%,
        100% 85%,
        95% 100%,
        85% 88%,
        70% 95%,
        55% 85%,
        40% 97%,
        25% 88%,
        15% 100%,
        5% 90%,
        0 85%
      );
    }

    &.shape-variant-2 {
      clip-path: polygon(
        0 15%,
        4% 0,
        15% 12%,
        25% 5%,
        35% 15%,
        48% 3%,
        60% 10%,
        75% 0,
        85% 12%,
        96% 2%,
        100% 15%,
        100% 85%,
        95% 100%,
        85% 88%,
        70% 95%,
        55% 85%,
        40% 97%,
        25% 88%,
        15% 100%,
        5% 90%,
        0 85%
      );
    }
  }

  .noise {
    --opacity: 0.5;
  }
</style>
