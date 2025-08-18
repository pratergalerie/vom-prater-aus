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
    cutouts.value = svgFiles.map((file, index) => {
      const isTop = index < svgFiles.length / 2
      const isLeft = index % 2 === 0

      // Add some randomness within the side area
      const randomOffsetY = Math.ceil((Math.random() - 0.5) * 10) // ±5% variation
      const randomOffsetX = Math.ceil((Math.random() - 0.5) * 10) // ±5% variation

      // Random size within bounds
      const size = Math.ceil(10 + Math.random() * (10 - 5))

      return {
        src: file.url,
        alignSelf: isTop ? 'flex-start' : 'center',
        justifySelf: isLeft ? 'left' : 'right',
        position: {
          top: `${randomOffsetY}%`,
          left: `${randomOffsetX}%`,
        },
        size: `${size}vw`,
      }
    })
  }
</script>

<template>
  <ClientOnly>
    <div class="cutouts-background">
      <img
        v-for="(cutout, index) in cutouts"
        :key="index"
        :src="cutout.src"
        alt=""
        :style="{
          '--parallax-speed': 1 + (index + 1) / 10,
          zIndex: index,
          alignSelf: cutout.alignSelf,
          justifySelf: cutout.justifySelf,
          maxWidth: cutout.size,
        }"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
  .cutouts-background {
    --cutout-max-height: 400px;

    /* Initialize variable to prevent error  */
    --parallax-speed: 0;

    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: grid;
    width: 100%;
    height: 100%;
    padding-top: var(--header-height);
    margin: 0 auto;
    overflow: clip;
    pointer-events: none;
    mix-blend-mode: multiply;
    opacity: 0.5;

    & > img {
      animation: parallax linear both;
      animation-timeline: view();

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }
  }

  @keyframes parallax {
    to {
      transform: translateY(calc(50vh * var(--parallax-speed))) rotate(90deg);
    }
  }
</style>
