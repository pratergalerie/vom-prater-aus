<script lang="ts" setup>
  type Keyword = {
    id: string
    name: string
  }

  // Create discriminated union type
  export type ListElement = {
    title: string
    img?: { src: string; alt: string }
    link: string
    year: string
    author: string
    quote?: string
    keywords: Keyword[]
    onKeywordClick: (name: string, selected: boolean) => void
  }

  const { title, author, img, link, year, keywords } =
    defineProps<ListElement>()
</script>

<template>
  <div class="story-card">
    <div class="story-card-inner">
      <div class="story-media">
        <template v-if="img">
          <NuxtLink :to="link">
            <NuxtImg
              :src="img.src"
              :alt="img.alt"
              class="story-image"
            />
          </NuxtLink>
        </template>
        <template v-else-if="quote">
          <div class="story-quote">
            <p>{{ quote }}</p>
          </div>
        </template>
      </div>
      <div class="story-info">
        <NuxtLink :to="link">
          <h2 class="story-title">{{ title }}</h2>
        </NuxtLink>
        <div class="story-meta">
          <p class="story-author">
            Von
            <span class="story-author-name">{{ author }}</span>
          </p>
          <div class="story-year">
            <Icon name="mdi:calendar" />
            <span>{{ year }}</span>
          </div>
        </div>
        <div
          v-if="keywords.length"
          class="story-keywords"
        >
          <BaseKeyword
            v-for="keyword in keywords"
            :id="keyword.id"
            :key="keyword.id"
            :name="keyword.name"
            @click="onKeywordClick"
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

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .story-card {
    background: var(--color-background);
    transition: transform 0.2s ease-in-out;
    will-change: transform;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .story-card-inner {
    background: var(--color-background);
    transition: transform 0.2s ease-in-out;
  }

  .story-card:hover,
  .story-card:focus {
    .story-card-inner {
      transform: translateY(-3%);
    }

    .story-image {
      filter: grayscale(0%);
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
