<script setup lang="ts">
  import { svgPaths as baseButtonSvgPaths } from '~/assets/svgs/paths/baseButton'
  import { svgPaths as iconButtonSvgPaths } from '~/assets/svgs/paths/iconButton'

  const props = withDefaults(
    defineProps<{
      type?: 'submit' | 'button'
      variant: 'primary' | 'secondary'
      layout: 'label' | 'icon' | 'label-icon'
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

  const svgPaths = computed(() => {
    return props.layout === 'icon' ? iconButtonSvgPaths : baseButtonSvgPaths
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
    return props.variant === 'primary'
      ? '/imgs/textures/halftone-texture-white.webp'
      : '/imgs/textures/halftone-texture-black.webp'
  })

  const dropShadow = computed(() => {
    if (props.layout === 'icon') {
      return props.variant === 'primary'
        ? `drop-shadow(-2px 2px 0 var(--color-black))`
        : `drop-shadow(-2px 2px 0 var(--color-white)) drop-shadow(-1px 1px 0 var(--color-black))`
    } else
      return props.variant === 'primary'
        ? `drop-shadow(-4px 4px 0 var(--color-black))`
        : `drop-shadow(-4px 4px 0 var(--color-white)) drop-shadow(-2px 2px 0 var(--color-black)`
  })

  const randomId = Math.random().toString(36).substring(7)
</script>

<template>
  <button
    :type="type"
    :class="{
      primary: variant === 'primary',
      secondary: variant === 'secondary',
      icon: layout === 'icon',
      disabled: disabled,
    }"
  >
    <div class="button-content">
      <NuxtLink
        v-if="href"
        :to="href"
        class="button-link"
      />
      <span
        v-if="layout === 'label'"
        class="button-label"
        :class="{ secondary: variant === 'secondary' }"
      >
        {{ label }}
      </span>
      <span
        v-if="layout === 'label-icon'"
        class="button-label-icon"
        :class="{ secondary: variant === 'secondary' }"
      >
        <span>{{ label }}</span>
        <span v-if="icon">
          <Icon
            :name="icon"
            mode="css"
            class="icon"
          />
        </span>
      </span>
      <div
        v-if="layout === 'icon' && icon"
        class="button-icon"
        :style="{ color: variant === 'primary' ? 'black' : 'white' }"
      >
        <Icon
          :name="icon"
          mode="css"
          class="button-icon"
        />
      </div>
    </div>
    <ClientOnly>
      <div class="button-background">
        <svg
          class="button-shape"
          :class="{
            primary: variant === 'primary',
            secondary: variant === 'secondary',
          }"
          :viewBox="layout === 'icon' ? '0 0 40 40' : '0 0 349 60'"
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
            :d="svgPath"
            :fill="`url(#button-texture-${randomId})`"
            stroke="var(--color-black)"
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
              layout === 'icon'
                ? `icon-button-clip-path-${randomId}`
                : `base-button-clip-path-${randomId}`
            "
          >
            <path :d="svgPath" />
          </clipPath>
          <rect
            :d="svgPath"
            :fill="
              variant === 'primary'
                ? 'var(--color-white)'
                : 'var(--color-black)'
            "
            :filter="`url(#button-vignette-${randomId})`"
            width="100%"
            height="100%"
            :clip-path="
              layout === 'icon'
                ? `url(#icon-button-clip-path-${randomId})`
                : `url(#base-button-clip-path-${randomId})`
            "
            opacity="0.8"
          />
        </svg>
      </div>
    </ClientOnly>
  </button>
</template>

<style scoped>
  .button-shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: v-bind(dropShadow);
    transition: filter 0.2s ease-out;

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  button {
    z-index: 800;
    display: grid;
    width: 100%;
    min-width: 180px;
    max-width: 400px;
    height: 60px;
    color: var(--color-black);
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.2s ease-out;

    &:hover,
    &:focus {
      transform: scale(1.01);

      &.primary .button-shape {
        filter: drop-shadow(-8px 8px 0 var(--color-black));
      }

      &.secondary .button-shape {
        filter: drop-shadow(-6px 6px 0 var(--color-white))
          drop-shadow(-2px 2px 0 var(--color-black));
      }

      &.primary.icon .button-shape {
        filter: drop-shadow(-4px 4px 0 var(--color-black));
      }

      &.secondary.icon .button-shape {
        filter: drop-shadow(-4px 4px 0 var(--color-white))
          drop-shadow(-2px 2px 0 var(--color-black));
      }
    }

    &.icon {
      width: 40px;
      min-width: 40px;
      height: 40px;
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
    color: inherit;
    text-decoration: none;
  }

  .button-content {
    position: relative;
    z-index: 2;
    display: flex;
    grid-area: 1 / 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .button-link {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }

  .button-background {
    position: relative;
    z-index: 1;
    display: flex;
    grid-area: 1 / 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .button-label,
  .button-icon,
  .button-label-icon {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    padding: var(--space-3xs);
    transform: translateY(-5%);
  }

  .button-label {
    width: 100%;
    height: 100%;
  }

  .button-icon {
    width: 65%;
    height: 65%;
    margin: auto;
  }

  .button-label,
  .button-label-icon {
    transition: transform 0.2s ease-out;

    &.secondary {
      color: var(--color-white);
    }

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
