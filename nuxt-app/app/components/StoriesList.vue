<script lang="ts" setup>
  import type { Database } from '~/types/supabase'

  type Story = Database['public']['Tables']['stories']['Row']
  type Author = Database['public']['Tables']['authors']['Row']

  const api = useAPI()
  const stories = ref<Story[]>([])
  const authors = ref<Record<string, Author>>({})

  // Fetch stories
  const { data: storiesData } = await api.getStories()
  if (storiesData.value) {
    stories.value = storiesData.value

    // Fetch authors for all stories
    const authorIds = [
      ...new Set(stories.value.map((story) => story.author_id)),
    ]
    const authorPromises = authorIds.map((id) => api.getAuthor(id))
    const authorResults = await Promise.all(authorPromises)

    authorResults.forEach((result) => {
      if (result.data.value) {
        authors.value[result.data.value.id] = result.data.value
      }
    })
  }
</script>

<template>
  <div class="stories-list">
    <div
      v-for="story in stories"
      :key="story.id"
      class="story-card"
    >
      <NuxtLink
        :to="`/stories/${story.slug}`"
        class="story-link"
      >
        <div
          v-if="story.featured_image"
          class="story-image"
        >
          <img
            :src="story.featured_image"
            :alt="story.title"
          />
        </div>
        <div class="story-info">
          <h2>{{ story.title }}</h2>
          <p class="author">
            Von
            <span class="author-name">{{
              authors[story.author_id]?.name || 'Unknown'
            }}</span>
          </p>
          <p class="year">{{ story.year }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  .stories-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: var(--padding-mobile);
  }

  .story-card {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
    transition: transform 0.3s ease;

    &:hover,
    &:focus {
      transform: translateY(-5px);
    }

    @media screen and (prefers-reduced-motion: reduce) {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
      transition: none;

      &:hover,
      &:focus {
        transform: translateY(-5px);
      }
    }
  }

  .story-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .story-image {
    position: relative;
    width: 100%;
    padding-top: 66.67%; /* 3:2 aspect ratio */
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .story-info {
    padding: 1rem;
    background: white;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .author {
      margin: 0.5rem 0;
      font-size: 0.9rem;

      .author-name {
        font-family: var(--font-link);
      }
    }

    .year {
      margin: 0;
      font-size: 0.8rem;
      color: var(--color-text);
    }
  }
</style>
