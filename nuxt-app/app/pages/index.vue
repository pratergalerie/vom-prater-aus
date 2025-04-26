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

  const { getFeaturedStories } = useAPI()
  const { locale } = useI18n()

  const { data: featuredStories, error: featuredStoriesError } =
    await getFeaturedStories()

  const { getPage } = useAPI()

  const { data: homepageContent, error: homepageContentError } = await getPage(
    'home',
    locale.value
  )

  if (featuredStoriesError.value || homepageContentError.value) {
    console.error(
      'Error fetching data:',
      featuredStoriesError.value || homepageContentError.value
    )
  }

  const containerRef = ref<HTMLElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rellaxInstance = useRellax('.rellax', {
    wrapper: containerRef.value as HTMLElement,
    center: true,
    vertical: true,
    horizontal: false,
  })

  const storiesSlides = computed(() => {
    if (!featuredStories.value) return []
    return featuredStories?.value.map((story) => ({
      img: story.featured_image
        ? {
            src: story.featured_image,
            alt: story.title,
          }
        : null,
      title: story.title,
      link: {
        text: story.title,
        href: `/stories/${story.slug}`,
      },
      year: story.year.toString(),
      quote: story.quote || '',
      author: story.author.name || '',
    }))
  })
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
  >
    <section
      v-for="section in homepageContent?.sections"
      :key="section.id"
      :class="section.name"
    >
      <!-- Stories Section -->
      <ClientOnly v-if="section.type === 'hero'">
        <StoriesCarousel
          :slides="storiesSlides"
          class="stories-carousel rellax"
          data-rellax-speed="-0.5"
        />
      </ClientOnly>
      <h1>{{ section.content.title }}</h1>
      <NuxtImg
        v-if="section.content.imageSrc"
        :src="section.content.imageSrc"
        :alt="section.content.imageAlt || ''"
      />
      <div class="text-block">
        <p
          v-for="(paragraph, index) in section.content.text"
          :key="index"
        >
          {{ paragraph }}
        </p>
      </div>
      <BaseButton
        v-if="section.content.buttonLabel"
        class="button"
        type="primary"
        variant="label-icon"
        icon="mdi:arrow-right"
        :label="section.content.buttonLabel"
        :link="section.content.buttonLink"
      />
    </section>

    <div class="cutouts">
      <NuxtImg
        src="/svgs/cutouts/1.svg"
        alt="Floating shape 1"
        class="floating-shape shape-1 rellax"
        data-rellax-speed="3"
      />
      <NuxtImg
        src="/svgs/cutouts/2.svg"
        alt="Floating shape 2"
        class="floating-shape shape-2 rellax"
        data-rellax-speed="2"
      />
      <NuxtImg
        src="/svgs/cutouts/3.svg"
        alt="Floating shape 3"
        class="floating-shape shape-3 rellax"
        data-rellax-speed="-3"
      />
      <NuxtImg
        src="/svgs/cutouts/4.svg"
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
    gap: 50px;
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

    /* Class added programmatically */
    /* stylelint-disable-next-line plugins/no-unused-selectors */
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

    &.berliner-prater {
      @container (min-width: 768px) {
        flex-direction: column;
        gap: 2rem;
        align-items: center;
      }

      img {
        width: 100%;
      }

      h1 {
        align-self: flex-start;
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

      .button {
        align-self: flex-end;

        @container (min-width: 768px) {
          align-self: flex-end;
        }
      }
    }

    /* Class added programmatically */
    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.create-story {
      p {
        @container (min-width: 500px) {
          align-self: flex-start;
          max-width: 60%;
          text-align: left;
        }
      }

      img {
        align-self: flex-start;
        width: 100%;

        @container (min-width: 500px) {
          width: 80%;
        }
      }

      .button {
        @container (min-width: 768px) {
          align-self: flex-start;
        }
      }
    }
  }

  .cutouts {
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
