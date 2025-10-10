<script setup lang="ts">
  export type Slide = {
    title: string
    img: { src: string; alt: string }
    link: string
    year: string
    quote?: string
    author: string
  }

  const _props = defineProps<Slide>()
</script>

<template>
  <div class="slide">
    <NuxtLink
      v-if="img"
      :to="link"
    >
      <NuxtImg
        class="image"
        :src="img.src"
        :alt="img.alt"
      />
    </NuxtLink>

    <div class="content">
      <span
        v-if="author"
        class="copyright"
      >
        ©{{ author }}
      </span>

      <div class="link-year">
        <NuxtLink
          v-if="link"
          class="highlight"
          :to="link"
        >
          {{ title }}
        </NuxtLink>

        <span class="year">{{ year }}</span>
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
  </div>
</template>

<style>
  .slide {
    display: grid;
    grid-template-rows: 1fr 80%;
    gap: 10px;
  }

  .image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    filter: grayscale(100%);
  }

  .copyright {
    grid-area: copyright;
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
    text-align: left;
  }

  .quote-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .quote {
    display: flex;
    width: fit-content;
    padding: var(--space-xs-s);
    font-size: var(--step-1);
    font-style: italic;
    text-wrap: balanced;
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

  .link-year {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;

    & a {
      font-size: var(--step-1);
      color: var(--color-brown);
      text-decoration: none;
    }
  }

  .year {
    font-size: 1rem;
  }
</style>
