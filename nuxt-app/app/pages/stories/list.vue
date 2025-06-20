<script lang="ts" setup>
  import type { Story } from '~/types/frontend'

  const api = useAPI()
  const stories = ref<Story[]>([])

  // SEO
  useHead({
    title: 'Stories - Vom Prater Aus',
    meta: [
      {
        name: 'description',
        content: 'Browse through our collection of stories from Prater.',
      },
    ],
  })

  const containerRef = ref<HTMLElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rellaxInstance = useRellax('.rellax', {
    wrapper: containerRef.value as HTMLElement,
    center: true,
    vertical: true,
    horizontal: false,
  })

  // Fetch approved stories

  const { data, error, status } = await api.getStories()
  if (data.value) {
    stories.value = data.value.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      author: {
        id: story.author.id,
        name: story.author.name,
        email: story.author.email,
      },
      year: story.year,
      keywords: story.keywords.map((k) => ({
        id: k.keyword.id,
        word: k.keyword.word,
      })),
      pages: [], // Initialize empty pages array since we don't need it in the list view
      createdAt: new Date(story.created_at || new Date()),
      modifiedAt: story.modified_at ? new Date(story.modified_at) : null,
      locale: story.locale.code as 'en' | 'de',
      status: story.status as Story['status'],
      featured: story.featured || false,
      featuredImage: story.featured_image,
      quote: story.quote,
    }))
  }

  if (error.value) {
    console.error('Error fetching stories:', error.value)
  }

  // Use a ref that starts as false and only updates on client side
  const isMasonry = ref(false)

  // Only run on client side to prevent hydration mismatch
  onMounted(() => {
    const updateMasonry = () => {
      isMasonry.value = window.innerWidth > 768
    }

    // Set initial value
    updateMasonry()

    // Add resize listener
    window.addEventListener('resize', updateMasonry)

    // Cleanup on unmount
    onUnmounted(() => {
      window.removeEventListener('resize', updateMasonry)
    })
  })
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">Stories</h1>

    <div
      v-if="status === 'pending'"
      class="loading"
    >
      Loading stories...
    </div>

    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>

    <div
      v-else-if="stories.length === 0"
      class="no-stories"
    >
      No stories available at the moment.
    </div>

    <div
      v-else
      ref="containerRef"
      class="stories-grid"
      :class="{ masonry: isMasonry }"
    >
      <StoryCard
        v-for="story in stories"
        :key="story.id"
        :story="story"
        class="rellax"
        :data-rellax-speed="Math.random() * -2"
      />
    </div>
  </div>
</template>

<style scoped>
  .page-container {
    padding: 2rem;
    margin: 0 auto;
  }

  .page-title {
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }

  .loading,
  .error,
  .no-stories {
    padding: 3rem;
    font-size: 1.2rem;
    text-align: center;
  }

  .error {
    color: var(--color-error);
  }

  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 4rem 2rem;

    &.masonry {
      /* Make left column items have a Y offset */
      .story-card:nth-child(2n + 1) {
        margin-top: 2rem;
      }
    }
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 1rem;
    }

    .page-title {
      margin-bottom: 1.5rem;
      font-size: 2rem;
    }

    .stories-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
