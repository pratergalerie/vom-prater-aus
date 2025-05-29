<script lang="ts" setup>
  import type { Story } from '~/types/frontend'

  defineProps<{
    story: Story
  }>()
</script>

<template>
  <div class="story-card">
    <NuxtLink
      :to="`/stories/${story.slug}`"
      class="story-link"
    >
      <div class="story-media">
        <template v-if="story.featuredImage">
          <img
            :src="story.featuredImage"
            :alt="story.title"
            class="story-image"
          />
        </template>
        <template v-else-if="story.quote">
          <div class="story-quote">
            <p>{{ story.quote }}</p>
          </div>
        </template>
      </div>
      <div class="story-info">
        <h2 class="story-title">{{ story.title }}</h2>
        <div class="story-meta">
          <p class="story-author">Von {{ story.author.name }}</p>
          <p class="story-year">{{ story.year }}</p>
        </div>
        <div
          v-if="story.keywords.length"
          class="story-keywords"
        >
          <span
            v-for="keyword in story.keywords"
            :key="keyword.id"
            class="keyword"
          >
            {{ keyword.word }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
  .story-card {
    background: var(--color-background);
    border: 1px solid var(--color-text-light);
    transition: transform 0.2s ease-in-out;

    @media screen and (prefers-reduced-motion: reduce) {
      background: var(--color-background);
      border: 1px solid var(--color-text-light);
      transition: none;
    }

    &:hover,
    &:focus {
      transform: translateY(-4px);
    }
  }

  .story-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .story-media {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .story-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story-quote {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    font-style: italic;
    color: var(--color-white);
    text-align: center;
    background: var(--color-primary);
  }

  .story-info {
    padding: 1.5rem;
  }

  .story-title {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: var(--color-text);
  }

  .story-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--color-text-light);
  }

  .story-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .keyword {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    color: var(--color-text);
    background: var(--color-primary-light);
    border-radius: 1rem;
  }
</style>
