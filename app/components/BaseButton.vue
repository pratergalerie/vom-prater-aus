<script setup lang="ts">
  const props = defineProps<{
    /**
     * @type {String} - The type of the button (primary or secondary)
     */
    type: 'primary' | 'secondary'
    /**
     * @type {String} - The variant of the button (label, icon or icon-label)
     */
    variant: 'label' | 'icon' | 'icon-label'
    /**
     * @type {String} - The label of the button
     */
    label: string
    /**
     * @type {String} - The icon of the button - optional
     */
    icon?: string

    /**
     * @type {Boolean} - The disabled state of the button
     */
    disabled?: boolean
  }>()

  function generateRandomSVGPath(): string {
    // Helper function to generate a random float within a defined range
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    // Original paths from your examples
    const svgPaths = [
      `M348.652 4.00717C348.652 4.00717 349.326 18.9262 348.673 28.9623C348.019 39.0037 349.586 51.503 348.746 53.8467C348.746 53.8467 341.495 57.0862 297.192 52.7065C252.883 48.3212 228.245 52.0158 208.531 51.7789C188.817 51.542 156.152 54.5572 138.169 52.5194C120.186 50.4816 93.7308 51.6091 76.766 51.0358C59.7946 50.4622 42.9521 52.8973 31.7431 52.0495C20.5338 51.2069 2.81045 53.4621 2.57141 53.0849C2.32615 52.7024 0.133999 40.7358 0.00207062 33.32C-0.123315 25.9045 5.487 3.79125 5.62631 3.7657C5.7653 3.74531 45.8441 2.7119 63.5935 3.8549C81.343 4.9979 114.275 3.5054 136.724 4.05254C159.174 4.59451 169.649 2.78763 188.497 2.60697C207.344 2.43148 221.989 -0.841494 237.993 0.206504C253.997 1.2545 329.583 4.785 348.652 4.00717Z`,
      `M350.503 1.75521C350.503 1.75521 349.329 16.8265 348.676 26.8627C348.023 36.904 346.843 49.4033 346.003 51.747C346.003 51.747 341.503 49.6792 297.196 50.6068C252.503 49.6792 228.249 49.9161 208.534 49.6792C188.82 49.4424 159.003 49.6792 140.003 49.6792C117.003 49.6792 92.9681 51.5586 76.0033 50.9853C59.0319 50.4116 42.7123 52.5948 31.5033 51.747C20.294 50.9044 2.81376 51.3624 2.57472 50.9853C2.32946 50.6027 2.70658 36.3161 2.57465 28.9003C2.44927 21.4847 -0.133876 1.78077 0.00543678 1.75521C0.144431 1.73483 43.5033 3.40031 63.5969 1.75521C83.6904 0.110117 114.278 1.40571 136.728 1.95285C159.178 2.49482 169.652 0.687945 188.5 0.507285C207.348 0.33179 221.999 -0.540727 238.003 0.507271C254.007 1.55527 331.435 2.53304 350.503 1.75521Z`,
      `M340.933 0.808052C340.933 0.808052 346.758 15.8793 346.105 25.9155C345.452 35.9569 347.933 46.4532 346.105 48.7321C346.105 48.7321 346.24 49.8723 301.933 50.7999C257.24 49.8723 225.678 48.9689 205.964 48.7321C186.25 48.4952 156.433 48.7321 137.433 48.7321C114.433 48.7321 90.3974 50.6115 73.4326 50.0381C56.4612 49.4645 40.1415 51.6476 28.9326 50.7999C17.7233 49.9573 6.17166 50.0367 5.93262 49.6596C5.68735 49.277 0.135859 35.369 0.00393111 27.9531C-0.121454 20.5376 2.79326 6.47871 2.93257 6.45316C3.07157 6.43277 4.43262 2.95317 61.0261 0.808052C117.62 -1.33707 105.983 1.40599 128.433 1.95312C150.882 2.4951 166.085 1.18639 184.933 1.00573C203.78 0.830238 218.428 -0.0423458 234.433 1.00565C250.437 2.05365 308.933 -0.439892 340.933 0.808052Z`,
    ]

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
