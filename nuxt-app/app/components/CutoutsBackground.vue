<script lang="ts" setup>
  const cutouts = ref<
    Array<{
      src: string
      alignSelf: 'flex-start' | 'center' | 'flex-end'
      justifySelf: 'left' | 'center' | 'right'
      position: {
        top: string
        left: string
      }
      size: string
      rotationSpeed: number
      rotationDirection: number
      rotationDegree: number
    }>
  >([])

  // Generate cutouts only on client side to prevent hydration mismatch
  onMounted(() => {
    if (import.meta.client) {
      // Load cutout images dynamically
      const { cutoutFiles } = useCutouts()

      // Watch for when cutout files are loaded and generate cutouts
      watch(
        cutoutFiles,
        (files) => {
          if (files.length > 0) {
            generateCutouts(files)
            // Apply scroll timeline after cutouts are generated
            nextTick(() => {
              applyScrollTimelines()
            })
          }
        },
        { immediate: true }
      )
    }
  })

  const applyScrollTimelines = () => {
    // Get all cutout images
    const images = document.querySelectorAll('.cutouts-background img')

    images.forEach((img) => {
      const element = img as HTMLElement

      // Apply animation with scroll timeline using Web Animations API
      element.animate(
        [
          {
            transform: 'translateY(0) rotate(0deg)',
          },
          {
            transform: `translateY(calc(25vh * var(--parallax-speed))) rotate(calc(var(--rotation-degree) * 1deg * var(--rotation-speed) * var(--rotation-direction)))`,
          },
        ],
        {
          fill: 'both',
          timeline: new ScrollTimeline({
            source: document.documentElement,
            axis: 'block',
          }),
        }
      )
    })
  }

  const minCutoutSize = 20
  const maxCutoutSize = 30
  const cutoutsCount = computed(() => cutouts.value.length)

  const generateCutouts = (
    svgFiles: Array<{ filename: string; url: string }>
  ) => {
    const alignSelfOptions = ['center', 'flex-end'] as const
    const justifySelfOptions = ['left', 'center', 'right'] as const

    // Shuffle justifySelf options to ensure no duplicates
    const shuffledJustifySelf = [...justifySelfOptions].sort(
      () => Math.random() - 0.5
    )

    cutouts.value = svgFiles.map((file, index) => {
      // Use shuffled array and cycle through if needed
      const randomAlignSelf =
        alignSelfOptions[Math.floor(Math.random() * alignSelfOptions.length)] ??
        'center'
      const randomJustifySelf =
        shuffledJustifySelf[index % shuffledJustifySelf.length] ?? 'center'

      // Add some randomness within the side area
      const randomOffsetY = Math.ceil((Math.random() - 0.5) * 10) // ±5% variation
      const randomOffsetX = Math.ceil((Math.random() - 0.5) * 10) // ±5% variation

      // Random rotation speed, direction, and degree
      const rotationSpeed = 0.5 + Math.random() * 1.5 // 0.5x to 2x speed
      const rotationDirection = Math.random() < 0.5 ? 1 : -1 // clockwise or counterclockwise
      const rotationDegree = Math.random() * 90 // 0deg to 90deg

      // Random size within bounds
      const size = Math.ceil(
        minCutoutSize + Math.random() * (maxCutoutSize - minCutoutSize)
      )

      return {
        src: file.url,
        alignSelf: randomAlignSelf,
        justifySelf: randomJustifySelf,
        position: {
          top: `${randomOffsetY}%`,
          left: `${randomOffsetX}%`,
        },
        size: `${size}vw`,
        rotationSpeed: rotationSpeed,
        rotationDirection: rotationDirection,
        rotationDegree: rotationDegree,
      }
    })
  }
</script>

<template>
  <ClientOnly>
    <div class="cutouts-background">
      <div
        v-for="(cutout, index) in cutouts"
        v-show="index < cutouts.length - 1"
        :key="index"
        class="cutout-wrapper"
      >
        <img
          :src="cutout.src"
          alt=""
          :style="{
            '--parallax-speed': 3 - index * 0.3,
            '--rotation-speed': cutout.rotationSpeed,
            '--rotation-direction': cutout.rotationDirection,
            '--rotation-degree': cutout.rotationDegree,
            zIndex: index,
            alignSelf: cutout.alignSelf,
            justifySelf: cutout.justifySelf,
            maxWidth: cutout.size,
          }"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
  .cutouts-background {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(v-bind(cutoutsCount), 1fr);
    width: 100%;
    max-width: calc(var(--max-width) + v-bind(maxCutoutSize + 'vw'));
    height: 100%;
    padding-top: var(--header-height);
    margin: 0 auto;
    pointer-events: none;
    mix-blend-mode: multiply;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .cutouts-background img {
      animation: none;
    }
  }

  .cutout-wrapper {
    display: grid;
    width: 100%;
    height: 100%;
  }
</style>
