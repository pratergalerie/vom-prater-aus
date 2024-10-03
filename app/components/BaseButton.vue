<script setup lang="ts">
  import { svgPaths } from '~/assets/svgs/paths/baseButton';

  const props = defineProps<{
    type: 'primary' | 'secondary'
    variant: 'label' | 'icon' | 'icon-label'
    label: string
    icon?: string
    disabled?: boolean
  }>()

  function generateRandomSVGPath(): string {
    // Helper function to generate a random float within a defined range
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    // Pick one of the paths at random
    const originalPath = svgPaths[Math.floor(Math.random() * svgPaths.length)]

    // Parse the original path to extract commands and numbers
    const pathParts = originalPath
      ? originalPath.match(/[a-zA-Z][^a-zA-Z]*/g) || []
      : []

    const variedPathParts = pathParts.map((part) => {
      const command = part[0] // Get the command (M, C, Z, etc.)
      const numbers = part
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map((num) => parseFloat(num)) // Extract numbers

      // Apply random variations to the numbers
      const variedNumbers = numbers.map((num) => {
        const newNum = num + randomInRange(-1.0, 1.0)
        return isNaN(newNum) ? 0 : newNum.toFixed(4) // Default to 0 if NaN
      })

      // Construct the varied path part
      return `${command} ${variedNumbers.join(' ')}`
    })

    // Join the varied parts back into a single path string
    const variedPath = variedPathParts.join(' ')

    return variedPath
  }

  // Generate a random SVG path for the button
  const svgPath = generateRandomSVGPath()

  const textureSrc = computed(() => {
    return props.type === 'primary'
      ? './imgs/textures/halftone-texture-white.webp'
      : './imgs/textures/halftone-texture-black.webp'
  })

  const dropShadow = computed(() => {
    return `drop-shadow(-4px 4px 0 ${props.type === 'primary' ? 'black' : 'none'})`
  })
</script>

<template>
  <button
    :class="{
      primary: props.type === 'primary',
      secondary: props.type === 'secondary',
    }"
  >
    <ClientOnly>
      <svg
        v-if="props.variant === 'label' || props.variant === 'icon-label'"
        class="button-shape"
        width="349"
        height="55"
        viewBox="0 0 350 55"
        fill="none"
        :class="{
          primary: props.type === 'primary',
          secondary: props.type === 'secondary',
          'button-shape': true,
        }"
      >
        <defs>
          <pattern
            id="button-texture"
            patternUnits="userSpaceOnUse"
            width="540px"
            height="360px"
          >
            <image
              :href="textureSrc"
              x="0"
              y="0"
              width="540px"
              height="360px"
            />
          </pattern>
        </defs>
        <path
          v-if="props.type === 'secondary'"
          :d="svgPath"
          fill="var(--white)"
          stroke="var(--black)"
          stroke-width="2"
          class="secondary-button-shadow"
        />
        <path
          :d="svgPath"
          fill="url(#button-texture)"
          stroke="var(--black)"
          stroke-width="2"
        />
        <!-- Add a "vignette" effect using radial blur, clipped to the path -->
        <filter id="vignette">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
          />
        </filter>
        <clipPath id="button-clip">
          <path :d="svgPath" />
        </clipPath>
        <rect
          :d="svgPath"
          :fill="props.type === 'primary' ? 'var(--white)' : 'var(--black)'"
          filter="url(#vignette)"
          width="100%"
          height="100%"
          clip-path="url(#button-clip)"
          opacity="0.8"
        />
      </svg>
    </ClientOnly>
    <span
      class="button-label"
      :class="{ secondary: type === 'secondary' }"
      >{{ props.label }}</span
    >
  </button>
</template>

<style scoped>
  button {
    position: relative;
    display: grid;
    width: 100%;
    max-width: 380px;
    height: 60px;
    max-height: 60px;
    padding: 0;
    color: var(--black);
    cursor: pointer;
    background: none;
    border: none;
  }

  .button-shape,
  .button-label {
    display: flex;
    grid-area: 1 / 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .button-label {
    z-index: 1;
    font-family: var(--button-font);

    &.secondary {
      color: var(--white);
    }
  }

  .button-shape {
    overflow: visible;
    filter: v-bind(dropShadow);
  }

  .secondary-button-shadow {
    transform: translate(-6px, 6px);
  }
</style>
