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

  const { getStories } = useAPI()

  const { data: stories, error, status } = await getStories()

  const pending = computed(() => {
    return status.value === 'pending'
  })

  if (error.value) {
    console.error('Error fetching stories:', error)
  }

  console.log('data', stories.value)

  const containerRef = ref<HTMLElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rellaxInstance = useRellax('.rellax', {
    wrapper: containerRef.value as HTMLElement,
    center: true,
    vertical: true,
    horizontal: false,
  })

  const storiesSlides = ref([
    {
      img: {
        src: '/imgs/prater/prater11.jpeg',
        alt: 'Berliner Prater',
        caption: '©Autor 1',
      },
      quote: 'Kann diese Nachmittage im Prater nur empfehlen!',
      link: {
        text: `${stories.value[0].title} (${stories.value[0].year})`,
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
        text: `${stories.value[1].title} (${stories.value[1].year})`,
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
        text: `${stories.value[2].title} (${stories.value[2].year})`,
        href: '/',
      },
    },
  ])
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
  >
    <section
      v-if="!pending"
      class="stories"
    >
      <ClientOnly>
        <StoriesCarousel
          :slides="storiesSlides"
          class="stories-carousel rellax"
          data-rellax-speed="-0.5"
        />
      </ClientOnly>
      <div class="text-block">
        <h1>{{ $t('pages.home.sections.stories.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.stories.text') }}
        </p>
      </div>
      <BaseButton
        :label="$t('pages.home.sections.stories.button')"
        icon="mdi:arrow-right"
        type="primary"
        variant="label-icon"
        class="button rellax"
        data-rellax-speed="-0.2"
        href="/stories/explorer"
      />
    </section>

    <section class="prater">
      <NuxtImg
        src="/imgs/prater/prater11.jpeg"
        alt="Berliner Prater"
        class="rellax"
        data-rellax-speed="0.5"
      />
      <div class="text-block">
        <h1>
          {{ $t('pages.home.sections.prater.title') }}
        </h1>
        <p>
          {{ $t('pages.home.sections.prater.text') }}
        </p>
      </div>
      <BaseButton
        class="button rellax"
        :label="$t('pages.home.sections.prater.button')"
        icon="mdi:arrow-right"
        type="primary"
        variant="label-icon"
        data-rellax-speed="0"
      />
    </section>

    <section class="create">
      <h1
        class="rellax"
        data-rellax-speed="-0.3"
      >
        {{ $t('pages.home.sections.create.title') }}
      </h1>
      <NuxtImg
        src="/imgs/prater/prater8.jpeg"
        alt="Berliner Prater"
        class="rellax"
        data-rellax-speed="-0.2"
      />
      <p
        class="rellax"
        data-rellax-speed="0.2"
      >
        {{ $t('pages.home.sections.create.text') }}
      </p>
      <BaseButton
        class="button rellax"
        :label="$t('pages.home.sections.create.button')"
        icon="mdi:arrow-right"
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    container-type: inline-size;
    container-name: main-container;

    @container (min-width: 768px) {
      gap: 100px;
    }

    @media (min-height: 1024px) {
      gap: 100px;
    }
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    min-height: 600px;
    margin: 0;
    container-type: inline-size;
    container-name: section-container;

    @container (min-width: 768px) {
      gap: 2rem;
      height: auto;
    }

    @media (min-height: 1024px) {
      height: auto;
    }

    img {
      width: 100%;
      object-fit: cover;
      mix-blend-mode: multiply;
      filter: grayscale(100%);
    }

    .text-block {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0;
    }

    h1 {
      font-size: clamp(1.4rem, 2.5cqi, 2.5rem);
      line-height: 1.3rem;
    }

    p {
      font-size: clamp(1rem, 1.5cqi, 1.2rem);
      line-height: 1.3rem;
    }

    &.stories {
      justify-content: flex-start;

      .stories-carousel {
        mix-blend-mode: multiply;
      }

      .text-block {
        max-width: 80%;

        @container (min-width: 768px) {
          max-width: 60%;
        }
      }
    }

    &.prater {
      @container (min-width: 768px) {
        flex-direction: column;
        gap: 2rem;
        align-items: center;
      }

      img {
        width: 100%;
        margin-left: calc(-1 * var(--padding-mobile));

        @media (min-width: 768px) {
          width: calc(100% + var(--padding-desktop));
          margin-left: calc(-1 * var(--padding-desktop));
        }
      }

      .text-block {
        align-self: flex-end;
        max-width: 80%;

        @container (min-width: 768px) {
          max-width: 60%;

          p {
            margin-left: 2rem;
          }
        }
      }

      h1 {
        margin-left: -2.5rem;
      }

      .button {
        align-self: flex-end;

        @container (min-width: 768px) {
          align-self: flex-end;
        }
      }
    }

    &.create {
      @container (min-width: 768px) {
        gap: 2rem;
        align-items: flex-end;
      }

      h1,
      p {
        max-width: 80%;

        @container (min-width: 768px) {
          align-self: flex-start;
          max-width: 60%;
          margin-left: 0;
          text-align: left;
        }
      }

      img {
        align-self: flex-end;
        width: 90vw;
        margin-right: calc(-1 * var(--padding-mobile));

        @container (min-width: 768px) {
          width: 80%;
          margin: 0 calc(-1 * var(--padding-desktop));
        }
      }

      .button {
        @container (min-width: 768px) {
          align-self: flex-start;
        }
      }
    }
  }

  .floating-shapes {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    pointer-events: none;
  }

  .floating-shape {
    position: absolute;
    mix-blend-mode: multiply;

    &.shape-1 {
      top: 150px;
      left: -20px;
      width: 80%;

      @container (min-width: 768px) {
        width: 40%;
      }
    }

    &.shape-2 {
      top: 600px;
      right: 50px;
      width: 90%;

      @container (min-width: 768px) {
        width: 50%;
      }
    }

    &.shape-3 {
      top: 1200px;
      right: -80px;
      width: 50%;

      @container (min-width: 768px) {
        width: 30%;
      }
    }

    &.shape-4 {
      top: 1800px;
      left: -50px;
      width: 50%;
      transform: rotate(10deg);

      @container (min-width: 768px) {
        width: 25%;
      }
    }
  }
</style>
