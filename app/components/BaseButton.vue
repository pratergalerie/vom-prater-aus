<script setup lang="ts">
  import { svgPaths as baseButtonSvgPaths } from '~/assets/svgs/paths/baseButton'
  import { svgPaths as iconButtonSvgPaths } from '~/assets/svgs/paths/iconButton'

  const props = defineProps<{
    type: 'primary' | 'secondary'
    variant: 'label' | 'icon' | 'icon-label'
    label?: string
    icon?: string
    disabled?: boolean
  }>()

  const svgPaths = computed(() => {
    return props.variant === 'icon' ? iconButtonSvgPaths : baseButtonSvgPaths
  })

  function generateRandomSVGPath(): string {
    // Helper function to generate a random float within a defined range
    // const randomInRange = (min: number, max: number) =>
    //   Math.random() * (max - min) + min

    // Pick one of the paths at random
    const originalPath =
      svgPaths.value[Math.floor(Math.random() * svgPaths.value.length)]

    // TODO - Implement path variation, below generates an error
    // Error: <path> attribute d: Expected path command, "….0495 34.1652 Z 0".

    // // Parse the original path to extract commands and numbers
    // const pathParts = originalPath
    //   ? originalPath.match(/[a-zA-Z][^a-zA-Z]*/g) || []
    //   : []

    // const variedPathParts = pathParts.map((part) => {
    //   const command = part[0] // Get the command (M, C, Z, etc.)
    //   const numbers = part
    //     .slice(1)
    //     .trim()
    //     .split(/[\s,]+/)
    //     .map((num) => parseFloat(num)) // Extract numbers

    //   // Apply random variations to the numbers
    //   const variedNumbers = numbers.map((num) => {
    //     const newNum = num + randomInRange(-1.0, 1.0)
    //     return isNaN(newNum) ? 0 : newNum.toFixed(4) // Default to 0 if NaN
    //   })

    //   const newPart = `${command} ${variedNumbers.join(' ')}`

    //   // Construct the varied path part
    //   return newPart
    // })

    // // Join the varied parts back into a single path string
    // const variedPath = variedPathParts.join(' ')

    // return variedPath

    return originalPath
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

  const iconName = computed(() => {
    return `mdi:${props.icon}`
  })

  const randomId = Math.random().toString(36).substring(7)
</script>

<template>
  <button
    :class="{
      primary: props.type === 'primary',
      secondary: props.type === 'secondary',
      icon: props.variant === 'icon',
    }"
  >
    <ClientOnly>
      <svg
        class="button-shape"
        :class="{
          primary: props.type === 'primary',
          secondary: props.type === 'secondary',
        }"
        :viewBox="props.variant === 'icon' ? '0 0 40 40' : '0 0 349 55'"
        fill="none"
      >
        <defs>
          <pattern
            :id="`button-texture-${randomId}`"
            patternUnits="userSpaceOnUse"
            width="540px"
            height="360px"
            patternTransform="scale(0.5 0.5)"
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
          :class="{
            icon: props.variant === 'icon',
          }"
        />
        <path
          :d="svgPath"
          :fill="`url(#button-texture-${randomId})`"
          stroke="var(--black)"
          stroke-width="2"
        />
        <!-- Add a "vignette" effect using radial blur, clipped to the path -->
        <filter :id="`button-vignette-${randomId}`">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
          />
        </filter>
        <clipPath
          :id="
            props.variant === 'icon'
              ? `icon-button-clip-path-${randomId}`
              : `base-button-clip-path-${randomId}`
          "
        >
          <path :d="svgPath" />
        </clipPath>
        <rect
          :d="svgPath"
          :fill="props.type === 'primary' ? 'var(--white)' : 'var(--black)'"
          :filter="`url(#button-vignette-${randomId})`"
          width="100%"
          height="100%"
          :clip-path="
            props.variant === 'icon'
              ? `url(#icon-button-clip-path-${randomId})`
              : `url(#base-button-clip-path-${randomId})`
          "
          opacity="0.8"
        />
      </svg>
    </ClientOnly>
    <span
      v-if="props.variant === 'label'"
      class="button-label"
      :class="{ secondary: props.type === 'secondary' }"
    >
      {{ props.label }}
    </span>
    <Icon
      v-if="props.variant === 'icon'"
      :name="iconName"
      :style="{ color: type === 'primary' ? 'black' : 'white' }"
      size="30px"
      mode="css"
      class="button-icon"
    />
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

    &.icon {
      max-width: 50px;
      max-height: 50px;
    }
  }

  .button-shape,
  .button-label,
  .button-icon {
    display: flex;
    grid-area: 1 / 1;
    align-items: center;
    justify-content: center;
  }

  .button-shape,
  .button-label {
    width: 100%;
    height: 100%;
  }

  .button-icon {
    /* Position span content in the center */
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    line-height: 20px;
    transform: translate(-50%, -50%);
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
    transform: translate(-5px, 5px);

    &.icon {
      transform: translate(-3px, 4px);
    }
  }
</style>
