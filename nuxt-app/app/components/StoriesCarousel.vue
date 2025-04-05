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

  const activeSlide = ref(1) // Start at the first real slide
  const isTransitioning = ref(false)

  // Update slide width based on viewport width
  const slideWidth = computed(() => {
    if (window.innerWidth >= 1024) {
      return 80 // 80vw on large screens
    } else if (window.innerWidth >= 768) {
      return 80 // 80vw on medium screens
    } else {
      return 100 // 100vw on mobile
    }
  })

  const slideSpacing = computed(() => {
    if (window && window.innerWidth >= 1024) {
      return 20 // 20vw spacing on large screens
    } else if (window && window.innerWidth >= 768) {
      return 20 // 20vw spacing on medium screens
    } else {
      return 0 // No spacing on mobile
    }
  })

  const totalSlidesWidth = computed(() => {
    return (
      slidesWithClones.value.length * slideWidth.value +
      (slidesWithClones.value.length - 1) * slideSpacing.value
    )
  })

  function nextSlide() {
    if (isTransitioning.value) return
    isTransitioning.value = true
    activeSlide.value++

    if (activeSlide.value === slidesWithClones.value.length - 1) {
      // When reaching the cloned last slide, reset to first real slide
      setTimeout(() => {
        activeSlide.value = 1 // First real slide
        isTransitioning.value = false
      }, 1000) // Match the transition duration
    } else {
      setTimeout(() => {
        isTransitioning.value = false
      }, 1000) // Match the transition duration
    }
  }

  const slideAutoChangeInterval = 5000

  onMounted(() => {
    setInterval(() => {
      nextSlide()
    }, slideAutoChangeInterval)
  })
</script>

<template>
  <div class="stories-carousel">
    <div
      class="slides"
      :style="{
        transform: `translateX(-${activeSlide * (slideWidth + slideSpacing)}vw)`,
        transition: isTransitioning ? 'transform 1s ease-in-out' : 'none',
        width: `${totalSlidesWidth}vw`,
      }"
    >
      <div
        v-for="(slide, index) in slidesWithClones"
        :key="index"
        class="slide"
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
    width: 100vw;
    height: 40dvh;
    min-height: 350px;
    margin: 0 calc(var(--padding-mobile) * -1);

    @container (min-width: 768px) {
      margin: 0 calc(var(--padding-desktop) * -1);
    }

    @media (min-height: 1024px) {
      height: auto;
    }

    overflow: hidden;
    container-type: inline-size;
    container-name: carousel-container;
  }

  .slides {
    display: flex;
    will-change: transform; /* Optimize for performance */

    @container (min-width: 768px) {
      gap: 20vw;
      margin-left: 20vw;
    }
  }

  .slide {
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
      '. image'
      'quote quote'
      '. link';
    grid-template-columns: 1fr 80%;
    gap: 10px;
    width: 100vw;
    height: 100%;
    container-name: slide-container;

    @container (min-width: 768px) {
      width: 80vw;
      height: 500px;
    }

    @media (min-width: 1024px) {
      width: 80vw;
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
      max-height: 30dvh;
      object-fit: cover;
      filter: grayscale(100%);
    }

    .copyright {
      font-size: 0.7rem;
    }
  }

  .quote {
    grid-area: quote;
    padding: 0 var(--padding-mobile);

    @container (min-width: 768px) {
      padding: 0 var(--padding-desktop);
    }

    font-style: italic;
    line-height: 1.6rem;
  }

  a {
    grid-area: link;

    /* Align to right */
    justify-self: end;
    margin: 0 var(--padding-mobile);

    @container (min-width: 768px) {
      margin: 0 var(--padding-desktop);
    }

    text-align: right;
  }
</style>
