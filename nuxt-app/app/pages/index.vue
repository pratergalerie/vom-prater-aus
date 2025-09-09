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
      <div class="section-text">
        <h2>{{ t('pages.home.sections.stories.title') }}</h2>
        <p>{{ t('pages.home.sections.stories.text') }}</p>
      </div>
      <BaseButton
        class="button"
        type="primary"
        variant="label"
        :label="t('pages.home.sections.stories.button')"
        href="/stories"
      />
    </section>

    <!-- Prater Section -->
    <section>
      <NuxtPicture
        src="imgs/anfaenge-prater.jpg"
        :alt="t('pages.home.sections.prater.imageAlt')"
      />
      <div class="section-text">
        <h2>{{ t('pages.home.sections.prater.title') }}</h2>
        <p>{{ t('pages.home.sections.prater.text') }}</p>
      </div>
      <BaseButton
        class="button"
        type="primary"
        variant="label"
        :label="t('pages.home.sections.prater.button')"
        href="/prater"
      />
    </section>

    <!-- Create Section -->
    <section>
      <NuxtPicture
        src="imgs/kreiskulturhaus-1.jpg"
        :alt="t('pages.home.sections.create.imageAlt')"
      />
      <div class="section-text">
        <h2>{{ t('pages.home.sections.create.title') }}</h2>
        <p>{{ t('pages.home.sections.create.text') }}</p>
      </div>
      <BaseButton
        class="button"
        type="primary"
        variant="label"
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
    gap: var(--space-2xl-3xl);
    width: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);

    & .section-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-s-m);
    }

    &:nth-child(even) {
      align-items: flex-end;

      & picture {
        width: 100%;
        max-width: 70%;
      }

      & .section-text {
        text-align: right;
      }
    }
  }
</style>
