<script lang="ts" setup>
  type Keyword = {
    id: string
    name: string
    selected: boolean
  }

  export type ListElement = {
    variant: 'image' | 'text'
    title: string
    link: string
    year: string
    author: string
    keywords: Keyword[]
    img: { src: string; alt: string } | null
    text: string | null
    onKeywordClick: (name: string, selected: boolean) => void
  }

  const { title, author, img, link, year, keywords } =
    defineProps<ListElement>()
</script>

<template>
  <div class="card">
    <div class="media">
      <template v-if="img">
        <NuxtLink :to="link">
          <NuxtImg
            :src="img.src"
            :alt="img.alt"
            class="image"
          />
        </NuxtLink>
      </template>
      <template v-else-if="text">
        <p class="text">{{ text }}</p>
      </template>
    </div>
    <div class="info">
      <NuxtLink :to="link">
        <h2 class="title">{{ title }}</h2>
      </NuxtLink>
      <div class="meta">
        <p class="author">
          Von
          <span class="author-name">{{ author }}</span>
        </p>
        <div class="year">
          <Icon name="mdi:calendar" />
          <span>{{ year }}</span>
        </div>
      </div>
      <div
        v-if="keywords.length"
        class="keywords"
      >
        <BaseKeyword
          v-for="keyword in keywords"
          :id="keyword.id"
          :key="keyword.id"
          :name="keyword.name"
          :selected="keyword.selected"
          @click="onKeywordClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .image {
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    filter: grayscale(100%);
    transition: filter 0.2s ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .text {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--space-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    font-style: italic;
    white-space: wrap;
    background: var(--color-white);
    transition: transform 0.2s ease-in-out;
  }

  .card {
    background: var(--color-background);
    transition: transform 0.2s ease-in-out;

    &:hover,
    &:focus {
      transform: translateY(-1%) scale(1.02);

      .text,
      .image {
        filter: grayscale(0%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .media {
    position: relative;
    height: 300px;
    cursor: pointer;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    padding: var(--space-s);
    padding-bottom: 0;
  }

  .title {
    font-size: var(--step-1);
    color: var(--color-text);
  }

  .author {
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
    color: var(--color-text-light);

    .author-name {
      font-style: italic;
    }
  }

  .year {
    display: flex;
    gap: var(--space-3xs);
    align-items: center;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-text-light);
  }

  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2xs);
  }
</style>
