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
    class="page-container"
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
      <h1>{{ section.content?.title }}</h1>
      <NuxtImg
        v-if="section.content?.imageSrc"
        :src="section.content?.imageSrc"
        :alt="section.content?.imageAlt || ''"
      />
      <div class="text-block">
        <p
          v-for="(paragraph, index) in section.content?.text"
          :key="index"
        >
          {{ paragraph }}
        </p>
      </div>
      <BaseButton
        v-if="section.content?.buttonLabel"
        class="button"
        type="primary"
        variant="label-icon"
        icon="mdi:arrow-right"
        :label="section.content?.buttonLabel"
        :href="section.content?.buttonLink"
      />
    </section>
    <CutoutsBackground />
  </div>
</template>

<style scoped>
  .page-container {
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
      gap: 1.5rem;
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
      font-size: 1rem;
      line-height: 1.5;

      @container main-container (min-width: 500px) {
        font-size: clamp(1.5rem, 1.6cqi, 1.8rem);
      }

      @container main-container (min-width: 768px) {
        font-size: clamp(1.8rem, 1.8cqi, 2rem);
      }

      @container main-container (min-width: 1000px) {
        font-size: clamp(2rem, 2.5cqi, 3rem);
      }
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
        align-items: center;
      }

      img {
        width: 100%;
      }

      h1 {
        align-self: flex-end;
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
</style>
