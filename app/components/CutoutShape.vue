<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      shapeClass: string
      color:
        | 'light-beige'
        | 'red'
        | 'brown'
        | 'mustard'
        | 'viridian'
        | 'mint'
        | 'cerulean-blue'
        | 'white'
        | 'black'
        | 'grey'
        | 'pink'
      purpose: 'decorative' | 'textbox'
      shadow: boolean
    }>(),
    {
      shapeClass: 'shape-textbox-1',
      purpose: 'decorative',
      shadow: true,
    }
  )

  const shapeColor = computed(() => {
    return `var(--${props.color})`
  })

  const shapeShadowColor = computed(() => {
    return `color-mix(in srgb, ${shapeColor.value} 30%, black)`
  })
</script>

<template>
  <div class="shape-container">
    <div
      class="shape noise"
      :class="shapeClass"
    >
      <slot />
    </div>
    <div
      v-if="shadow"
      class="shape-shadow"
      :class="shapeClass"
    ></div>
  </div>
</template>

<style scoped>
  .shape-container {
    display: grid;
  }

  .shape {
    z-index: 1;
    grid-area: 1 / 1;
    background: v-bind(shapeColor);
  }

  .shape-shadow {
    z-index: 0;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    background: v-bind(shapeShadowColor);
    transform: translate(-5px, 5px);
  }
</style>
