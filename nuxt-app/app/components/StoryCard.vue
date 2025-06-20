<script lang="ts" setup>
  import type { Story } from '~/types/frontend'

  defineProps<{
    story: Story
  }>()

  function handleKeywordClick(id: string) {
    console.log(id)
  }
</script>

<template>
  <div class="story-card">
    <div class="story-card-inner">
      <div class="story-media">
        <template v-if="story.featuredImage">
          <NuxtLink :to="`/stories/${story.slug}`">
            <NuxtImg
              :src="story.featuredImage"
              :alt="story.title"
              class="story-image"
            />
          </NuxtLink>
        </template>
        <template v-else-if="story.quote">
          <div class="story-quote">
            <p>{{ story.quote }}</p>
          </div>
        </template>
      </div>
      <div class="story-info">
        <NuxtLink :to="`/stories/${story.slug}`">
          <h2 class="story-title">{{ story.title }}</h2>
        </NuxtLink>
        <div class="story-meta">
          <p class="story-author">
            Von
            <span class="story-author-name">{{ story.author.name }}</span>
          </p>
          <div class="story-year">
            <Icon name="mdi:calendar" />
            <span>{{ story.year }}</span>
          </div>
        </div>
        <div
          v-if="story.keywords.length"
          class="story-keywords"
        >
          <BaseKeyword
            v-for="keyword in story.keywords"
            :id="keyword.id"
            :key="keyword.id"
            :keyword="keyword.word"
            @click="handleKeywordClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .story-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    filter: grayscale(100%);
    transition:
      filter 0.2s ease-in-out,
      transform 0.2s ease-in-out;

    @media screen and (prefers-reduced-motion: reduce) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: multiply;
      filter: grayscale(100%);
      transition: none;
    }
  }

  .story-card {
    background: var(--color-background);
    transition: transform 0.2s ease-in-out;
    will-change: transform;

    @media screen and (prefers-reduced-motion: reduce) {
      background: var(--color-background);
      transition: none;
      will-change: auto;

      &:hover,
      &:focus {
        .story-card-inner {
          transform: none;
        }

        .story-image {
          filter: grayscale(0%);
        }
      }
    }
  }

  .story-card-inner {
    background: var(--color-background);
    transition: transform 0.2s ease-in-out;
  }

  .story-card:hover,
  .story-card:focus {
    .story-card-inner {
      transform: translateY(-0.2rem);
    }

    .story-image {
      filter: grayscale(0%);

      /* Scale up the image */
      transform: scale(1.05);
    }
  }

  .story-media {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
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
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 1.5rem;
  }

  .story-title {
    font-size: 1.5rem;
    line-height: 1.8rem;
    color: var(--color-text);
  }

  .story-author {
    font-size: 0.9rem;
    color: var(--color-text-light);

    .story-author-name {
      font-style: italic;
    }
  }

  .story-year {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .story-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--color-text-light);
  }

  .story-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
</style>
