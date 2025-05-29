<script lang="ts" setup>
  import type { Story } from '~/types/frontend'
  import type { Database } from '~/types/supabase'

  type APIStory = Omit<
    Database['public']['Tables']['stories']['Row'],
    'author_id' | 'locale_id'
  > & {
    author: Database['public']['Tables']['authors']['Row']
    locale: Pick<
      Database['public']['Tables']['locales']['Row'],
      'id' | 'code' | 'name'
    >
  }

  const api = useAPI()
  const stories = ref<Story[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

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

  // Fetch approved stories
  try {
    const { data } = await api.getStories()
    if (data.value) {
      // Filter only approved stories and convert to frontend type
      stories.value = data.value
        .filter((story: APIStory) => story.status === 'approved')
        .map((story: APIStory) => ({
          id: story.id,
          title: story.title,
          slug: story.slug,
          author: {
            id: story.author.id,
            name: story.author.name,
            email: story.author.email,
          },
          year: story.year,
          keywords: [], // We'll get keywords in a separate query if needed
          pages: [], // We'll get pages in a separate query if needed
          createdAt: new Date(story.created_at || new Date()),
          modifiedAt: story.modified_at ? new Date(story.modified_at) : null,
          locale: story.locale.code as 'en' | 'de',
          status: story.status as Story['status'],
          featured: story.featured || false,
          featuredImage: story.featured_image,
          quote: story.quote,
        }))
    }
  } catch (err) {
    error.value = 'Failed to load stories'
    console.error('Error fetching stories:', err)
  } finally {
    isLoading.value = false
  }

  // Fetch stories on mount
</script>

<template>
  <div class="stories-list-page">
    <h1 class="page-title">Stories</h1>

    <div
      v-if="isLoading"
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
      class="stories-grid"
    >
      <StoryCard
        v-for="story in stories"
        :key="story.id"
        :story="story"
      />
    </div>
  </div>
</template>

<style scoped>
  .stories-list-page {
    max-width: 1200px;
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
    color: red;
  }

  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .stories-list-page {
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
