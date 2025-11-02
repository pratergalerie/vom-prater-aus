<script lang="ts" setup>
  const route = useRoute()
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

  const { cutoutFiles } = useCutouts()

  // Store active animations so we can cancel them before regenerating
  const activeAnimations = ref<Animation[]>([])

  // Generate cutouts only on client side to prevent hydration mismatch
  onMounted(() => {
    if (import.meta.client) {
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

  // Watch for route changes and regenerate cutouts based on new page height
  watch(
    () => route.path,
    () => {
      if (import.meta.client && cutoutFiles.value.length > 0) {
        // Wait for DOM to update with new page content
        nextTick(() => {
          // Small delay to ensure page content has fully rendered
          setTimeout(() => {
            generateCutouts(cutoutFiles.value)
            nextTick(() => {
              applyScrollTimelines()
            })
          }, 100)
        })
      }
    }
  )

  const applyScrollTimelines = () => {
    // Get all cutout images
    const images = document.querySelectorAll('.cutout-wrapper')

    images.forEach((wrapper) => {
      const element = wrapper as HTMLElement

      // Create a view timeline that tracks when element enters/exits viewport
      const viewTimeline = new ViewTimeline({
        subject: element,
        axis: 'block',
      })

      const img = element.querySelector('img') as HTMLElement
      if (!img) return

      // Animate the cutout falling and rotating as it passes through viewport
      // Cutouts enter from bottom and exit at top (fall slower than scroll)
      img.animate(
        [
          {
            transform: 'translateY(0vh) rotate(0deg)',
          },
          {
            transform:
              'translateY(-30vh) rotate(calc(var(--rotation-degree) * 1deg * var(--rotation-direction)))',
          },
        ],
        {
          fill: 'both',
          timeline: viewTimeline,
          rangeStart: 'entry 0%',
          rangeEnd: 'exit 100%',
        }
      )
    })
  }

  const minCutoutSize = 20
  const maxCutoutSize = 30
  const cutoutsCount = computed(() => cutouts.value.length)

  // Calculate number of cutouts based on document height
  const calculateCutoutCount = (): number => {
    if (!import.meta.client) return 0

    const documentHeight = document.documentElement.scrollHeight
    // Target spacing: one cutout every ~500px
    const targetSpacing = 500

    // Add 1 because the last cutout is always hidden (behind footer)
    return Math.floor(documentHeight / targetSpacing) + 1
  }

  const generateCutouts = (
    svgFiles: Array<{ filename: string; url: string }>
  ) => {
    if (svgFiles.length === 0) return

    const alignSelfOptions = ['center', 'flex-end'] as const
    const justifySelfOptions = ['left', 'center', 'right'] as const

    // Calculate how many cutouts to render based on document height
    const cutoutCount = calculateCutoutCount()

    // Shuffle justifySelf options to ensure no duplicates
    const shuffledJustifySelf = [...justifySelfOptions].sort(
      () => Math.random() - 0.5
    )

    // Helper function to select a random cutout different from the previous one
    const selectRandomCutout = (
      previousIndex: number | null
    ): number => {
      if (svgFiles.length === 1) return 0

      let randomIndex: number
      do {
        randomIndex = Math.floor(Math.random() * svgFiles.length)
      } while (randomIndex === previousIndex)

      return randomIndex
    }

    // Generate cutouts, ensuring no consecutive duplicates
    let previousCutoutIndex: number | null = null
    cutouts.value = Array.from({ length: cutoutCount }, (_, index) => {
      // Select a random cutout that's different from the previous one
      const cutoutIndex = selectRandomCutout(previousCutoutIndex)
      previousCutoutIndex = cutoutIndex
      const file = svgFiles[cutoutIndex]!

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
