<script setup lang="ts">
  const { t } = useI18n()

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
  <div class="layout-container">
    <!-- Stories Section -->
    <section>
      <ClientOnly>
        <StoriesCarousel
          :slides="storiesSlides"
          class="stories-carousel rellax"
          data-rellax-speed="-0.5"
        />
      </ClientOnly>
      <h1>{{ t('pages.home.sections.stories.title') }}</h1>
      <p>{{ t('pages.home.sections.stories.text') }}</p>
      <BaseButton
        class="button"
        type="primary"
        variant="label-icon"
        icon="mdi:arrow-right"
        :label="t('pages.home.sections.stories.button')"
        href="/stories"
      />
    </section>

    <!-- Prater Section -->
    <section>
      <NuxtImg
        src="imgs/berliner-prater.jpg"
        :alt="t('pages.home.sections.prater.imageAlt')"
        :modifiers="{ grayscale: true }"
      />
      <h1>{{ t('pages.home.sections.prater.title') }}</h1>
      <p>{{ t('pages.home.sections.prater.text') }}</p>
      <BaseButton
        class="button"
        type="primary"
        variant="label-icon"
        icon="mdi:arrow-right"
        :label="t('pages.home.sections.prater.button')"
        href="/prater"
      />
    </section>

    <!-- Create Section -->
    <section>
      <h1>{{ t('pages.home.sections.create.title') }}</h1>
      <NuxtImg
        src="imgs/create-story.jpg"
        :alt="t('pages.home.sections.create.imageAlt')"
        :modifiers="{ grayscale: true }"
      />
      <p>{{ t('pages.home.sections.create.text') }}</p>
      <BaseButton
        class="button"
        type="primary"
        variant="label-icon"
        icon="mdi:arrow-right"
        :label="t('pages.home.sections.create.button')"
        href="/stories/create"
      />
    </section>
  </div>
</template>

<style scoped>
  .layout-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &:nth-child(even) {
      align-items: flex-end;

      & img {
        max-width: 70%;
      }

      & p {
        text-align: right;
      }
    }

    @container (min-width: 768px) {
      gap: 1.5rem;
    }
  }
</style>
