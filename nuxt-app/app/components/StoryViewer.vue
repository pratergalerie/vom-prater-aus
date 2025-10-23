<script lang="ts" setup>
  import type { Story } from '~/types/frontend'

  const props = defineProps<{
    story: Story
    showCloseButton?: boolean
  }>()

  const currentPageIndex = ref(0)
  const isLightboxOpen = ref(false)
  const currentLightboxImage = ref('')
  const currentLightboxAlt = ref('')

  const currentPage = computed(() => {
    return props.story?.pages[currentPageIndex.value]
  })

  const topImageMasksIndexes = props.story?.pages.map(() => {
    return Math.floor(Math.random() * 3) + 1
  })

  const bottomImageMasksIndexes = props.story?.pages.map(() => {
    return Math.floor(Math.random() * 3) + 1
  })

  const topImageMask = computed(() => {
    return `url(/svgs/story-page/image-masks/top/${topImageMasksIndexes[currentPageIndex.value]}.svg) top no-repeat`
  })

  const bottomImageMask = computed(() => {
    return `url(/svgs/story-page/image-masks/bottom/${bottomImageMasksIndexes[currentPageIndex.value]}.svg) bottom no-repeat`
  })

  const imageMask = computed(() => {
    return `${topImageMask.value}, ${bottomImageMask.value}, linear-gradient(black 0 0)`
  })

  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  function handleImageClick(imageSrc: string, alt: string) {
    currentLightboxImage.value = imageSrc
    currentLightboxAlt.value = alt
    isLightboxOpen.value = true
  }

  function handleLightboxClose() {
    isLightboxOpen.value = false
  }

  function handlePageChange(index: number) {
    currentPageIndex.value = index
  }
</script>

<template>
  <div
    v-if="story"
    class="story-container"
  >
    <article
      class="story-page"
      :class="{ inverted: currentPage?.layout === 'text-over-image' }"
    >
      <div
        v-if="currentPageIndex === 0"
        class="story-title-image-container"
      >
        <NuxtImg
          v-if="currentPage?.image"
          :src="currentPage?.image"
          :alt="story?.title || ''"
          @click="
            handleImageClick(currentPage?.image || '', story?.title || '')
          "
        />
        <div
          class="story-title-container"
          :class="{
            'top-aligned': currentPage?.layout === 'text-over-image',
          }"
        >
          <h1>{{ story?.title }}</h1>
          <p>{{ story?.year }}</p>
          <p>
            Eine Geschichte von
            <span class="author-name">{{ story?.author.name }}</span>
          </p>
        </div>
      </div>

      <div
        v-if="
          currentPage?.image &&
          currentPageIndex > 0 &&
          currentPage?.layout.includes('image')
        "
        class="image-container"
      >
        <NuxtImg
          :src="currentPage?.image || ''"
          :alt="story?.title || ''"
          @click="
            handleImageClick(currentPage?.image || '', story?.title || '')
          "
        />
      </div>

      <div
        v-if="currentPage?.text && currentPage?.layout.includes('text')"
        class="text-container"
      >
        <p>{{ currentPage.text }}</p>
      </div>
    </article>

    <div class="bottom-controls">
      <BaseButton
        v-if="showCloseButton"
        variant="secondary"
        layout="icon"
        icon="mdi-arrow-left"
        class="close-button"
        @click="emit('close')"
      />
      <div class="pagination">
        <button
          v-for="(page, index) in story.pages"
          :key="page.id || index"
          @click="handlePageChange(index)"
        >
          <span :class="{ active: currentPageIndex === index }" />
        </button>
      </div>
    </div>

    <Lightbox
      :is-open="isLightboxOpen"
      :image-src="currentLightboxImage"
      :image-alt="currentLightboxAlt"
      @close="handleLightboxClose"
    />
  </div>
</template>

<style scoped>
  .story-container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100dvh - var(--header-height) - var(--padding-mobile));

    @media screen and (min-width: 768px) {
      height: calc(100dvh - var(--header-height) - var(--padding-tablet));
    }

    @media screen and (min-width: 1024px) {
      height: calc(100dvh - var(--header-height) - var(--padding-desktop));
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story-page {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    min-height: 0; /* Important for flex child to respect parent's height */

    &.inverted {
      flex-direction: column-reverse;
    }
  }

  .story-title-image-container {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 50%;
    overflow: hidden;

    img {
      mask: v-bind(imageMask);
      mask-size: 100%;
      mask-composite: exclude;
    }
  }

  .text-container,
  .image-container {
    box-sizing: border-box;
    width: 100%;
  }

  .image-container {
    flex: 1;
    min-height: 50%;
    overflow: hidden;
  }

  .text-container {
    display: block;
    width: 100%;
    max-height: 50%;
    padding: var(--padding-mobile);
    overflow: auto;

    & p {
      width: 100%;
      text-align: left;
    }
  }

  .story-title-container {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0.5rem;
    width: 60%;
    padding: 40px;
    padding-bottom: 50px;
    background: url('/svgs/story-page/title-box/1.png') no-repeat center;
    background-size: 100% 100%;

    &.top-aligned {
      top: 0;
      bottom: auto;
    }
  }

  .author-name {
    margin-left: 0.3rem;
    font-family: var(--font-link);
  }

  h1 {
    font-size: 1.1rem;
  }

  .bottom-controls {
    display: grid;
    flex-shrink: 0;
    grid-template-areas: 'close pagination .';
    grid-template-columns: 40px 1fr 40px;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    .close-button {
      grid-area: close;
      width: 40px;
    }

    .pagination {
      display: flex;
      grid-area: pagination;
      gap: 1rem;
      width: fit-content;
      margin: 0 auto;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        cursor: pointer;
        background: none;
        border: none;

        span {
          display: block;
          width: 10px;
          height: 10px;
          background: url('/svgs/story-page/pagination/page.svg') no-repeat
            center;

          &.active {
            width: 1rem;
            height: 1rem;
            background: url('/svgs/story-page/pagination/current-page.svg')
              no-repeat center;
          }
        }
      }
    }
  }
</style>
