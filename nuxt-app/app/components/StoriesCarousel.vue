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

  const totalSlidesWidth = computed(() => {
    return (
      slidesWithClones.value.length * 100 + slidesWithClones.value.length * 40
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
  <div
    class="stories-carousel rellax"
    data-rellax-speed="0.5"
  >
    <div
      class="slides"
      :style="{
        transform: `translateX(-${activeSlide * 100}vw)`,
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
    margin: 0 calc(var(--padding) * -1);

    /* Add negative padding margin */
    overflow: hidden;
  }

  .slides {
    display: flex;
    will-change: transform; /* Optimize for performance */
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
    padding: 0 var(--padding);
    font-style: italic;
    line-height: 1.6rem;
  }

  a {
    grid-area: link;

    /* Align to right */
    justify-self: end;
    margin: 0 var(--padding);
    text-align: right;
  }
</style>
