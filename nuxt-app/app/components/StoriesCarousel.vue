<script setup lang="ts">
  const props = defineProps<{
    slides: {
      img: {
        src: string
        alt: string
        caption: string
      }
      quote: string
      link: {
        text: string
        href: string
      }
    }[]
  }>()

  const slidesWithClones = computed(() => {
    // Add clones for infinite loop
    return [
      props.slides[props.slides.length - 1], // Clone last slide at the start
      ...props.slides,
      props.slides[0], // Clone first slide at the end
    ]
  })

  const carouselRef = ref<HTMLDivElement | null>(null)
  const currentSlideIndex = ref(1) // Start at first real slide
  const isTransitioning = ref(false)
  const slideWidth = ref(0)
  const resizeTimeout = ref<number | null>(null)

  const slideWidthPx = computed(() => {
    if (!slideWidth.value) return '100%' // Fallback to 100% if width is 0
    return `${slideWidth.value}px`
  })

  const slideWidthVw = computed(() => {
    if (!window || !slideWidth.value) return 100 // Fallback to 100vw if width is 0
    return (slideWidth.value / window.innerWidth) * 100
  })

  const slideSpacing = computed(() => {
    if (window.innerWidth >= 1024) {
      return 5 // 5vw spacing on large screens
    } else if (window.innerWidth >= 768) {
      return 4 // 4vw spacing on medium screens
    } else {
      return 2 // 2vw spacing on mobile
    }
  })

  const totalSlidesWidth = computed(() => {
    const slideWidthWithSpacing = slideWidthVw.value + slideSpacing.value
    return slidesWithClones.value.length * slideWidthWithSpacing
  })

  const slideTranslateX = computed(() => {
    const slideWidthWithSpacing = slideWidthVw.value + slideSpacing.value
    return currentSlideIndex.value * -slideWidthWithSpacing
  })

  function handleResize() {
    if (resizeTimeout.value) {
      window.clearTimeout(resizeTimeout.value)
    }

    resizeTimeout.value = window.setTimeout(() => {
      if (carouselRef.value) {
        const newWidth = carouselRef.value.offsetWidth
        if (newWidth > 0 && newWidth !== slideWidth.value) {
          slideWidth.value = newWidth
          // Force a recalculation of the current position
          const currentPosition = currentSlideIndex.value
          currentSlideIndex.value = -1
          nextTick(() => {
            currentSlideIndex.value = currentPosition
            isTransitioning.value = true
            setTimeout(() => {
              isTransitioning.value = false
            }, 100)
          })
        }
      }
    }, 150)
  }

  function nextSlide() {
    if (isTransitioning.value) return

    isTransitioning.value = true
    currentSlideIndex.value++

    // Handle the transition to cloned slides
    if (currentSlideIndex.value === slidesWithClones.value.length - 1) {
      setTimeout(() => {
        isTransitioning.value = false
        currentSlideIndex.value = 1 // Jump back to the first real slide
      }, 1000)
    } else if (currentSlideIndex.value === 0) {
      setTimeout(() => {
        isTransitioning.value = false
        currentSlideIndex.value = slidesWithClones.value.length - 2 // Jump to the last real slide
      }, 1000)
    } else {
      setTimeout(() => {
        isTransitioning.value = false
      }, 1000)
    }
  }

  const slideAutoChangeInterval = 5000

  onMounted(() => {
    // Initial calculation
    nextTick(() => {
      if (carouselRef.value) {
        slideWidth.value = carouselRef.value.offsetWidth
      }
    })

    // Start the auto-slide interval
    const intervalId = setInterval(() => {
      nextSlide()
    }, slideAutoChangeInterval)

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Cleanup function
    onUnmounted(() => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout.value) {
        window.clearTimeout(resizeTimeout.value)
      }
    })
  })
</script>

<template>
  <div
    ref="carouselRef"
    class="stories-carousel"
  >
    <div
      class="slides"
      :style="{
        transform: `translateX(${slideTranslateX}vw)`,
        transition: isTransitioning ? 'transform 1s ease-in-out' : 'none',
        width: `${totalSlidesWidth}vw`,
      }"
    >
      <div
        v-for="(slide, index) in slidesWithClones"
        :key="index"
        class="slide"
        :style="{ width: slideWidthPx }"
      >
        <div
          v-if="slide"
          class="picture-wrapper"
        >
          <NuxtImg
            :src="slide.img.src"
            :alt="slide.img.alt"
            class="photo"
          />
          <span class="copyright">{{ slide.img.caption }}</span>
        </div>

        <span
          v-if="slide"
          class="quote"
        >
          {{ slide.quote }}
        </span>
        <NuxtLink
          v-if="slide"
          :to="slide.link.href"
        >
          <span class="highlight">{{ slide.link.text }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stories-carousel {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 40%;
    min-height: 350px;
    overflow: hidden;
    container-type: inline-size;
    container-name: carousel-container;

    @container (min-width: 768px) {
      height: 100%;
    }
  }

  .slides {
    display: flex;
    gap: v-bind(slideSpacing + 'vw');
    will-change: transform;
  }

  .slide {
    display: grid;
    grid-template-areas:
      '. image'
      'quote quote'
      '. link';
    grid-template-columns: 1fr 80%;
    gap: 10px;
    height: 100%;
    container-name: slide-container;

    @container (min-width: 768px) {
      gap: 30px;
    }
  }

  .picture-wrapper {
    flex-direction: column;
    grid-area: image;
    width: 100%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
    }

    .copyright {
      font-size: 0.7rem;
    }
  }

  .quote {
    grid-area: quote;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    margin-left: 10%;
    font-size: 1.5rem;
    font-style: italic;
    line-height: 1.6rem;

    @container (min-width: 768px) {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  a {
    grid-area: link;
    justify-self: end;
    text-align: right;
  }
</style>
