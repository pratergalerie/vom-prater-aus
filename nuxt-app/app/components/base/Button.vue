<script setup lang="ts">
  import { svgPaths as baseButtonSvgPaths } from '~/assets/svgs/paths/baseButton'
  import { svgPaths as iconButtonSvgPaths } from '~/assets/svgs/paths/iconButton'

  const props = defineProps<{
    type: 'primary' | 'secondary'
    variant: 'label' | 'icon' | 'label-icon'
    label?: string
    icon?: string
    href?: string
    disabled?: boolean
  }>()

  const svgPaths = computed(() => {
    return props.variant === 'icon' ? iconButtonSvgPaths : baseButtonSvgPaths
  })

  // function generateRandomSVGPath(): string {
  //   // Helper function to generate a random float within a defined range
  //   const randomInRange = (min: number, max: number) =>
  //     Math.random() * (max - min) + min

  //   // Pick one of the paths at random
  //   const originalPath =
  //     svgPaths.value[Math.floor(Math.random() * svgPaths.value.length)]

  //   // TODO - Implement path variation, below generates an error
  //   // Error: <path> attribute d: Expected path command, "….0495 34.1652 Z 0".

  //   // Parse the original path to extract commands and numbers
  //   const pathParts = originalPath
  //     ? originalPath.match(/[a-zA-Z][^a-zA-Z]*/g) || []
  //     : []

  //   const variedPathParts = pathParts.map((part) => {
  //     const command = part[0] // Get the command (M, C, Z, etc.)
  //     const numbers = part
  //       .slice(1)
  //       .trim()
  //       .split(/[\s,]+/)
  //       .map((num) => parseFloat(num)) // Extract numbers

  //     // Apply random variations to the numbers
  //     const variedNumbers = numbers.map((num) => {
  //       const newNum = num + randomInRange(-1.0, 1.0)
  //       return isNaN(newNum) ? 0 : newNum.toFixed(4) // Default to 0 if NaN
  //     })

  //     const newPart = `${command} ${variedNumbers.join(' ')}`

  //     // Construct the varied path part
  //     return newPart
  //   })

  //   // Join the varied parts back into a single path string
  //   const variedPath = variedPathParts.join(' ')

  //   return variedPath
  // }

  // Deactivate path variation for now
  const svgPath = svgPaths.value[0]

  const textureSrc = computed(() => {
    return props.type === 'primary'
      ? '/imgs/textures/halftone-texture-white.webp'
      : '/imgs/textures/halftone-texture-black.webp'
  })

  const dropShadow = computed(() => {
    return `drop-shadow(-4px 4px 0 ${props.type === 'primary' ? 'black' : 'none'})`
  })

  const randomId = Math.random().toString(36).substring(7)
</script>

<template>
  <button
    :class="{
      primary: type === 'primary',
      secondary: type === 'secondary',
      icon: variant === 'icon',
    }"
  >
    <ClientOnly>
      <svg
        class="button-shape"
        :class="{
          primary: type === 'primary',
          secondary: type === 'secondary',
        }"
        :viewBox="variant === 'icon' ? '0 0 40 40' : '0 0 349 55'"
        fill="none"
        preserveAspectRatio="none"
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
          v-if="type === 'secondary'"
          :d="svgPath"
          fill="var(--white)"
          stroke="var(--black)"
          stroke-width="2"
          class="secondary-button-shadow"
          :class="{
            icon: variant === 'icon',
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
            variant === 'icon'
              ? `icon-button-clip-path-${randomId}`
              : `base-button-clip-path-${randomId}`
          "
        >
          <path :d="svgPath" />
        </clipPath>
        <rect
          :d="svgPath"
          :fill="type === 'primary' ? 'var(--white)' : 'var(--black)'"
          :filter="`url(#button-vignette-${randomId})`"
          width="100%"
          height="100%"
          :clip-path="
            variant === 'icon'
              ? `url(#icon-button-clip-path-${randomId})`
              : `url(#base-button-clip-path-${randomId})`
          "
          opacity="0.8"
        />
      </svg>
    </ClientOnly>
    <span
      v-if="variant === 'label'"
      class="button-label"
      :class="{ secondary: type === 'secondary' }"
    >
      {{ label }}
    </span>
    <span
      v-if="variant === 'label-icon'"
      class="button-label-icon"
      :class="{ secondary: type === 'secondary' }"
    >
      <NuxtLink
        v-if="href"
        :to="href"
      >
        {{ label }}
      </NuxtLink>

      <span v-else>
        {{ label }}
      </span>
      <span v-if="icon">
        <Icon
          :name="icon"
          mode="css"
          class="icon"
        />
      </span>
    </span>
    <div
      v-if="variant === 'icon' && icon"
      class="button-icon"
      :style="{ color: type === 'primary' ? 'black' : 'white' }"
    >
      <Icon
        :name="icon"
        mode="css"
        class="button-icon"
        size="1.2rem"
      />
    </div>
  </button>
</template>

<style scoped>
  button {
    display: grid;
    width: 100%;
    max-width: 380px;
    max-height: 60px;
    padding: 0;
    color: var(--black);
    cursor: pointer;
    background: none;
    border: none;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .button-shape,
  .button-label,
  .button-icon,
  .button-label-icon {
    display: flex;
    grid-area: 1 / 1;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .button-label {
    width: 100%;
    height: 100%;
  }

  .button-icon {
    /* Position span content in the center */
    z-index: 1;
    margin: auto;
  }

  .button-label,
  .button-label-icon {
    z-index: 1;
    font-family: var(--button-font);
    font-size: 1rem;

    &.secondary {
      color: var(--white);
    }
  }

  .button-shape {
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: v-bind(dropShadow);
  }

  .icon {
    width: 1.2rem;
    height: 1.2rem;
  }

  .secondary-button-shadow {
    transform: translate(-5px, 5px);

    &.icon {
      transform: translate(-3px, 4px);
    }
  }
</style>
