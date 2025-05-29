<script lang="ts" setup>
  import type { Database } from '~/types/supabase'

  type StoryPage = Database['public']['Tables']['story_pages']['Row']
  type Story = Omit<
    Database['public']['Tables']['stories']['Row'],
    'author_id' | 'locale_id'
  > & {
    author: Database['public']['Tables']['authors']['Row']
  }

  definePageMeta({
    layout: 'no-footer',
  })

  const route = useRoute()
  const api = useAPI()

  const storySlug = route.params.slug as string
  const story = ref<Story | null>(null)
  const storyPages = ref<StoryPage[]>([])

  // Fetch story data by slug
  const { data: storyData } = await api.getStoryBySlug(storySlug)
  if (storyData.value) {
    story.value = storyData.value

    // Fetch story pages
    const { data: pagesData } = await api.getStoryPages(story.value.id)
    if (pagesData.value) {
      storyPages.value = pagesData.value.sort(
        (a, b) => a.page_order - b.page_order
      )
    }
  }
</script>

<template>
  <Suspense>
    <template #default>
      <StoryViewer
        v-if="story"
        :story="story"
        :story-pages="storyPages"
        :show-close-button="true"
        @close="$router.back()"
      />
    </template>
    <template #fallback>
      <div class="loading-container">
        <div class="loading-spinner" />
      </div>
    </template>
    <template #error>
      <div class="error-container">
        <p>Ein Fehler ist aufgetreten. Bitte versuche es erneut.</p>
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--color-black);
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @media screen and (prefers-reduced-motion: reduce) {
      width: 50px;
      height: 50px;
      border: 5px solid var(--color-black);
      border-bottom-color: transparent;
      border-radius: 50%;
      animation: none;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
