<script lang="ts" setup>
  import type { Story } from '~/types/frontend'
  import { transformStoryData } from '~/utils/story'

  const route = useRoute()
  const api = useAPI()

  const storySlug = route.params.slug as string
  const story = ref<Story>()

  // Fetch story data by slug
  const { data: storyData, status, error } = await api.getStoryBySlug(storySlug)
  if (storyData.value) {
    story.value = transformStoryData(storyData.value)
  }
</script>

<template>
  <div v-if="status === 'pending'">
    <div class="loading-container">
      <div class="loading-spinner" />
    </div>
  </div>
  <div v-else-if="error">
    <div class="error-container">
      <p>Ein Fehler ist aufgetreten. Bitte versuche es erneut.</p>
    </div>
  </div>
  <StoryViewer
    v-else-if="story"
    :story="story"
    :show-close-button="true"
    @close="$router.back()"
  />
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
