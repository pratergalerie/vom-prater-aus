<script setup lang="ts">
  import emblaCarouselVue from 'embla-carousel-vue'
  import type { EmblaOptionsType } from 'embla-carousel'
  import Autoplay from 'embla-carousel-autoplay'
  import type { Slide } from './StoriesCarouselSlide.vue'
  import StoriesCarouselSlide from './StoriesCarouselSlide.vue'
  import type { StrapiImage } from '~~/types/strapi'

  const { strapiUrl } = useRuntimeConfig().public

  const { data: slidesData } = await useGetStories({
    featured: true,
  })

  const slides = slidesData.value
    .map<(Slide & { id: string }) | undefined>((story) => {
      // Check if featured story has any images
      const firstSectionWithImage = story.sections.find(
        (section) => section.image !== null
      )
      if (firstSectionWithImage === undefined) {
        return undefined
      }

      return {
        id: story.documentId,
        img: {
          src: `${strapiUrl}${(firstSectionWithImage.image as StrapiImage).url}`,
          alt:
            (firstSectionWithImage.image as StrapiImage).alternativeText ?? '',
        },
        title: story.title,
        link: `/stories/${story.slug}`,
        year: story.year.toString(),
        quote: story.quote,
        author: story.authorName,
      }
    })
    .filter((story) => story !== undefined)

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
          v-for="slide in slides"
          :key="slide.id"
          class="embla__slide"
        >
          <StoriesCarouselSlide
            :title="slide.title"
            :img="slide.img"
            :link="slide.link"
            :year="slide.year"
            :quote="slide.quote"
            :author="slide.author"
          />
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
</style>
