<script setup lang="ts">
  import emblaCarouselVue from 'embla-carousel-vue'
  import type { EmblaOptionsType } from 'embla-carousel'
  import Autoplay from 'embla-carousel-autoplay'

  const props = defineProps<{
    slides: {
      img: {
        src: string
        alt: string
      } | null
      quote: string
      link: {
        text: string
        href: string
      }
      year: string
      author: string
    }[]
  }>()

  const options: EmblaOptionsType = {
    loop: true,
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
  }

  const [emblaRef] = emblaCarouselVue(options, [Autoplay()])
</script>

<template>
  <div class="stories-carousel">
    <div
      ref="emblaRef"
      class="embla"
    >
      <div class="embla__container">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="embla__slide"
        >
          <div class="slide">
            <NuxtImg
              v-if="slide.img"
              class="image"
              :src="slide.img.src"
              :alt="slide.img.alt"
            />

            <div class="content">
              <span
                v-if="slide.author"
                class="copyright"
              >
                ©{{ slide.author }}
              </span>

              <div class="link-year">
                <NuxtLink
                  v-if="slide"
                  :to="slide.link.href"
                >
                  <span class="title highlight">{{ slide.link.text }}</span>
                </NuxtLink>

                <span class="year">{{ slide.year }}</span>
              </div>

              <div class="quote-wrapper">
                <div class="quote">
                  <NuxtImg
                    class="quote-symbol open"
                    src="/svgs/quote.svg"
                    alt=""
                  />
                  <span>
                    {{ slide.quote }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stories-carousel {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .embla {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .embla__container {
    display: flex;
    height: 100%;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

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

  .title {
    font-size: var(--step-1);
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
  }

  a {
    font-size: 1rem;
  }

  .year {
    font-size: 1rem;
  }
</style>
