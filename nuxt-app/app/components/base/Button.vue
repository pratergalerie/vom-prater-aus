<script setup lang="ts">
  import { svgPaths as baseButtonSvgPaths } from '~/assets/svgs/paths/baseButton'
  import { svgPaths as iconButtonSvgPaths } from '~/assets/svgs/paths/iconButton'

  const props = defineProps<{
    type: 'primary' | 'secondary'
    variant: 'label' | 'icon' | 'label-icon'
    label?: string
    icon?: string
    href?: string | null
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
    if (props.variant === 'icon') {
      return props.type === 'primary'
        ? `drop-shadow(-2px 2px 0 var(--color-black))`
        : `drop-shadow(-2px 2px 0 var(--color-white)) drop-shadow(-1px 1px 0 var(--color-black))`
    } else
      return props.type === 'primary'
        ? `drop-shadow(-4px 4px 0 var(--color-black))`
        : `drop-shadow(-4px 4px 0 var(--color-white)) drop-shadow(-2px 2px 0 var(--color-black)`
  })

  const randomId = Math.random().toString(36).substring(7)
</script>

<template>
  <button
    :class="{
      primary: type === 'primary',
      secondary: type === 'secondary',
      icon: variant === 'icon',
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
        v-if="variant === 'icon' && icon"
        class="button-icon"
        :style="{ color: type === 'primary' ? 'black' : 'white' }"
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
            primary: type === 'primary',
            secondary: type === 'secondary',
          }"
          :viewBox="variant === 'icon' ? '0 0 40 40' : '0 0 349 60'"
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
              variant === 'icon'
                ? `icon-button-clip-path-${randomId}`
                : `base-button-clip-path-${randomId}`
            "
          >
            <path :d="svgPath" />
          </clipPath>
          <rect
            :d="svgPath"
            :fill="
              type === 'primary' ? 'var(--color-white)' : 'var(--color-black)'
            "
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
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: v-bind(dropShadow);
      transition: none;
    }
  }

  button {
    display: grid;
    width: 100%;
    min-width: 300px;
    max-width: 400px;
    height: 60px;
    padding: 0;
    color: var(--color-black);
    cursor: pointer;
    background: none;
    border: none;
    container-type: inline-size;
    container-name: button-container;
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

      &.icon .button-shape {
        filter: drop-shadow(-3px 3px 0 var(--color-white))
          drop-shadow(-1px 1px 0 var(--color-black));
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
      display: grid;
      width: 100%;
      min-width: 300px;
      max-width: 400px;
      height: 60px;
      padding: 0;
      color: var(--color-black);
      cursor: pointer;
      background: none;
      border: none;
      container-type: inline-size;
      container-name: button-container;
      transition: none;

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

        &.icon .button-shape {
          filter: drop-shadow(-3px 3px 0 var(--color-white))
            drop-shadow(-1px 1px 0 var(--color-black));
        }
      }
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @container (min-width: 500px) {
    max-width: 360px;
  }

  @media screen and (prefers-reduced-motion: reduce) {
    display: grid;
    width: 100%;
    min-width: 300px;
    max-width: 500px;
    height: 60px;
    padding: 0;
    color: var(--color-black);
    cursor: pointer;
    background: none;
    border: none;
    container-type: inline-size;
    container-name: button-container;
    transition: none;

    &:hover,
    &:focus {
      transform: scale(1.02);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    @container (min-width: 500px) {
      max-width: 360px;
    }
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
  }

  .button-label {
    width: 100%;
    height: 100%;
  }

  .button-icon {
    margin: auto;
  }

  .button-label,
  .button-label-icon {
    font-family: var(--font-button);
    font-size: 1rem;
    transition: transform 0.2s ease-out;

    &.secondary {
      color: var(--color-white);
    }

    @media screen and (prefers-reduced-motion: reduce) {
      font-family: var(--font-button);
      font-size: 1rem;
      transition: none;

      &.secondary {
        color: var(--color-white);
      }
    }
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
