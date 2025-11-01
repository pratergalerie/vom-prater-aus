<script setup lang="ts">
  export type Slide = {
    title: string
    img: { src: string; alt: string }
    link: string
    year: string
    quote: string | null
    author: string
  }

  const _props = defineProps<Slide>()
</script>

<template>
  <NuxtLink
    v-if="img"
    :to="link"
    class="slide"
  >
    <NuxtImg
      class="image"
      :src="img.src"
      :alt="img.alt"
    />

    <div class="info-quote">
      <div class="info">
        <h2>{{ title }}</h2>

        <div class="author-year">
          <span>
            {{ `${$t('pages.stories.story.memoryBy')} ${author}` }}
          </span>

          <div class="year">
            <Icon name="mdi:calendar" />
            <span>{{ year }}</span>
          </div>
        </div>
      </div>

      <div
        class="quote-wrapper"
        :style="{ visibility: quote ? 'visible' : 'hidden' }"
      >
        <div class="quote">
          <NuxtImg
            class="quote-symbol open"
            src="/svgs/quote.svg"
            alt=""
          />
          <span>
            {{ quote }}
            <NuxtImg
              class="quote-symbol close"
              src="/svgs/quote.svg"
              alt=""
            />
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
  .slide {
    display: flex;
    flex-direction: column;
    font-family: inherit;
    color: inherit;
  }

  .image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    filter: grayscale(100%);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    justify-content: space-between;
    justify-content: flex-start;
  }

  .info-quote {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-s);
    padding: var(--space-m) 0;
  }

  .author-year {
    display: flex;
    gap: var(--space-xs);
    align-items: flex-end;
    text-align: right;
  }

  .year {
    display: flex;
    gap: var(--space-3xs);
    align-items: center;
  }

  .quote-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
  }

  .quote {
    display: flex;
    padding: var(--space-xs-s);
    font-size: var(--step-2);
    font-style: italic;
    font-weight: 600;
    text-wrap: balance;
  }

  .quote-symbol {
    z-index: 0;
    width: auto;
    height: var(--space-xs-s);
    opacity: 0.3;

    &.open {
      transform: translateY(-50%);
    }

    &.close {
      transform: translateY(50%) rotate(180deg);
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
