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

  const storiesSlides = ref([
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
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
  >
    <section class="stories">
      <StoriesCarousel
        :slides="storiesSlides"
        class="stories-carousel rellax"
      />
      <div class="text-block">
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
    margin-top: var(--header-height);
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    height: calc(100vh);
    margin: 0;

    img {
      width: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }

    .text-block {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0;
    }

    h1 {
      font-size: 1.4rem;
      line-height: 1.8rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.3rem;
    }

    &.stories {
      justify-content: flex-start;
      height: auto;

      .stories-carousel {
        mix-blend-mode: multiply;
      }

      .text-block {
        max-width: 80%;
      }
    }

    &.prater {
      img {
        margin-left: calc(-1 * var(--padding));
      }

      .text-block {
        align-self: flex-end;
        max-width: 80%;

        h1 {
          margin-left: -2.5rem;
        }
      }
    }

    &.create {
      /* stylelint-disable-next-line no-descending-specificity */
      h1,
      p {
        max-width: 80%;
        margin-left: auto;
        text-align: right;
      }

      img {
        width: 100vw;
        margin: 0 calc(-1 * var(--padding));
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
