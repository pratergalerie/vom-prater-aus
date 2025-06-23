<script lang="ts" setup>
  const cutouts = ref<
    Array<{
      id: string
      src: string
      speed: number
      position: {
        top: string
        left: string
      }
      size: {
        width: string
        height: string
      }
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
          }
        },
        { immediate: true }
      )
    }
  })

  function generateCutouts(svgFiles: Array<{ filename: string; url: string }>) {
    // Define row spacing and positioning
    const rowSpacing = 25 // percentage between rows
    const leftMargin = -5 // percentage from left edge (negative value to go beyond the edge)
    const rightMargin = 35 // percentage from right edge (moved more towards left)
    const minSize = 100 // minimum size in pixels
    const maxSize = 400 // maximum size in pixels

    cutouts.value = svgFiles.map((file, index) => {
      // Calculate row position (one per row)
      const rowTop = 10 + index * rowSpacing

      // Alternate between left and right sides
      const isLeftSide = index % 2 === 0
      const sidePosition = isLeftSide ? leftMargin : 100 - rightMargin

      // Add some randomness within the side area
      const randomOffset = (Math.random() - 0.5) * 10 // ±5% variation
      const finalLeft = Math.min(95, sidePosition + randomOffset)

      // Random size within bounds
      const size = minSize + Math.random() * (maxSize - minSize)

      return {
        id: `cutout-${index + 1}`,
        src: file.url,
        speed: Math.random() * 4 - 2,
        position: {
          top: `${rowTop}%`,
          left: `${finalLeft}%`,
        },
        size: {
          width: `${size}px`,
          height: `${size}px`,
        },
      }
    })
  }
</script>

<template>
  <ClientOnly>
    <div
      v-if="cutouts.length > 0"
      class="cutouts-background"
    >
      <div
        v-for="cutout in cutouts"
        :key="cutout.id"
        v-rellax
        class="cutout rellax"
        :style="{
          top: cutout.position.top,
          left: cutout.position.left,
          width: cutout.size.width,
          height: cutout.size.height,
        }"
        :data-rellax-speed="cutout.speed"
      >
        <img
          :src="cutout.src"
          :alt="cutout.id"
          :style="{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
  .cutouts-background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    pointer-events: none;
    user-select: none;
    mix-blend-mode: multiply;
  }

  .cutout {
    position: absolute;
    transform: translate(-50%, -50%);
  }
</style>
