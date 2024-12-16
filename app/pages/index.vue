<script setup lang="ts">
  useHead({
    title: 'Vom Prater Aus',
    meta: [
      {
        name: 'description',
        content: 'Home page',
      },
    ],
  })

  const containerRef = ref<HTMLElement | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rellaxInstance = useRellax('.rellax', {
    wrapper: containerRef.value,
    center: true,
    vertical: true,
    horizontal: false,
  })

  const carouselSlides = ref([
    {
      img: {
        src: '/imgs/prater/prater11.jpeg',
        alt: 'Berliner Prater',
        caption: '©Autor 1',
      },
      quote: 'Kann diese Nachmittage im Prater nur empfehlen!',
      link: {
        text: 'Meine Lieblingsplätze in Berlin (2003)',
        href: '/',
      },
    },
    {
      img: {
        src: '/imgs/prater/prater12.jpeg',
        alt: 'Berliner Prater',
        caption: '©Autor 2',
      },
      quote: 'Ein wunderbarer Ort zum Entspannen!',
      link: {
        text: 'Erholung pur (1999)',
        href: '/',
      },
    },
    {
      img: {
        src: '/imgs/prater/prater13.jpeg',
        alt: 'Berliner Prater',
        caption: '©Autor 3',
      },
      quote: 'Ein Muss für jeden Berlin-Besucher',
      link: {
        text: 'Meine Berlin-Tipps (2005)',
        href: '/',
      },
    },
  ])

  const slidesWithClones = computed(() => {
    // Add clones for infinite loop
    return [
      carouselSlides.value[carouselSlides.value.length - 1], // Clone last slide at the start
      ...carouselSlides.value,
      carouselSlides.value[0], // Clone first slide at the end
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

  onMounted(() => {
    setInterval(() => {
      nextSlide()
    }, 1000) // Change slide every 5 seconds
  })
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
  >
    <section class="section stories">
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
              <picture>
                <NuxtImg
                  :src="slide.img.src"
                  :alt="slide.img.alt"
                  class="photo"
                />
              </picture>
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
      <div class="text-block stories">
        <h1>{{ $t('pages.home.sections.stories.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.stories.text') }}
        </p>
      </div>
      <BaseButton
        :label="$t('pages.home.sections.stories.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        class="rellax"
        data-rellax-speed="-0.2"
      />
    </section>

    <section class="section prater">
      <picture>
        <NuxtImg
          src="/imgs/prater/prater11.jpeg"
          alt="Berliner Prater"
          class="photo rellax"
          data-rellax-speed="0.5"
        />
      </picture>
      <div class="text-block prater">
        <h1>{{ $t('pages.home.sections.prater.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.prater.text') }}
        </p>
      </div>
      <BaseButton
        class="rellax"
        :label="$t('pages.home.sections.prater.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        data-rellax-speed="0"
      />
    </section>

    <section class="section create">
      <div class="text-block create">
        <h1>{{ $t('pages.home.sections.create.title') }}</h1>
        <picture>
          <NuxtImg
            src="/imgs/prater/prater8.jpeg"
            alt="Berliner Prater"
            class="photo rellax"
            data-rellax-speed="-0.2"
          />
        </picture>
        <p>
          {{ $t('pages.home.sections.create.text') }}
        </p>
      </div>
      <BaseButton
        class="rellax"
        :label="$t('pages.home.sections.create.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        data-rellax-speed="0.1"
      />
    </section>

    <div class="floating-shapes">
      <NuxtImg
        src="/svgs/floating-shapes/1.svg"
        alt="Floating shape 1"
        class="floating-shape shape-1 rellax"
        data-rellax-speed="3"
      />
      <NuxtImg
        src="/svgs/floating-shapes/2.svg"
        alt="Floating shape 2"
        class="floating-shape shape-2 rellax"
        data-rellax-speed="2"
      />
      <NuxtImg
        src="/svgs/floating-shapes/3.svg"
        alt="Floating shape 3"
        class="floating-shape shape-3 rellax"
        data-rellax-speed="-3"
      />
      <NuxtImg
        src="/svgs/floating-shapes/4.svg"
        alt="Floating shape 4"
        class="floating-shape shape-4 rellax"
        data-rellax-speed="-1"
      />
    </div>
  </div>
</template>

<style scoped>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: calc(100vh);
    padding-top: calc(var(--header-height) + var(--padding));
    margin: 0;

    picture {
      z-index: 2;
      display: grid;
      margin-right: calc(-1 * var(--padding));
      margin-left: calc(-1 * var(--padding));
      mix-blend-mode: multiply;

      .photo {
        grid-area: image;
        width: 100%;
        object-fit: cover;
        filter: grayscale(100%);
      }
    }

    &.stories {
      .stories-carousel {
        position: relative;
        width: 100vw;
        height: 360px; /* Adjust to your preferred height */

        /* Add negative margins */
        margin-left: calc(-1 * var(--padding));
        overflow: hidden;
        mix-blend-mode: multiply;
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
        grid-template-columns: 1fr 90%;
        gap: 10px;
        width: 100vw;
        height: 100%;
        padding: var(--padding);
      }

      .picture-wrapper {
        flex-direction: column;
        grid-area: image;
        width: 100%;

        picture {
          display: block;
          height: 225px;
          margin-left: 0;
          overflow: hidden;
        }

        .copyright {
          font-size: 0.8rem;
        }
      }

      .quote {
        grid-area: quote;
        font-style: italic;
        line-height: 1.6rem;
      }

      a {
        grid-area: link;

        /* Align to right */
        justify-self: end;
        margin-left: var(--padding);
        text-align: right;
      }
    }

    &.prater {
      /* stylelint-disable-next-line no-descending-specificity */
      picture {
        grid-template-areas: 'image .';
        grid-template-columns: 1fr 70px;
      }

      h1 {
        margin-left: -2.5rem;
      }
    }

    &.create {
      /* stylelint-disable-next-line no-descending-specificity */
      picture {
        grid-template-areas: 'image';
        grid-template-columns: 100%;
        margin-left: -95px;

        .photo {
          width: 100%;

          /*
          ? For some reason this transform needs to be applied
          ? in order to mix-blend-mode to work on Safari iOS?
          */
          transform: translate3d(0, 0, 0);
        }
      }

      padding-bottom: calc(var(--header-height) + 3 * var(--padding));
    }

    .text-block {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0;

      h1 {
        font-size: 1.4rem;
        line-height: 1.8rem;
      }

      p {
        font-size: 1rem;
        line-height: 1.3rem;
      }

      &.stories {
        max-width: 80%;
      }

      &.prater {
        align-self: flex-end;
        max-width: 80%;
      }

      &.create {
        align-self: flex-end;
        max-width: 80%;

        h1,
        p {
          text-align: right;
        }
      }
    }
  }

  .floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100vw;
    height: 300vh;
    overflow-x: hidden;
  }

  .floating-shape {
    position: absolute;
    mix-blend-mode: multiply;

    &.shape-1 {
      top: 150px;
      left: -20px;
      width: 80%;
    }

    &.shape-2 {
      top: calc(50vh + 40px);
      right: 50px;
      width: 90%;
    }

    &.shape-3 {
      top: calc(100vh + 250px);
      right: -80px;
      width: 50%;
    }

    &.shape-4 {
      top: calc(200vh + 50px);
      left: -50px;
      width: 50%;
      transform: rotate(10deg);
    }
  }
</style>
