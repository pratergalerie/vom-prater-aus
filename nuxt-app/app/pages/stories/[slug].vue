<script lang="ts" setup>
  import type { Database } from '~/types/supabase'

  type StoryPage = Database['public']['Tables']['story_pages']['Row']
  type Story = Database['public']['Tables']['stories']['Row'] & {
    author: Database['public']['Tables']['authors']['Row']
  }

  type StoryContent = {
    id: string
    title: string
    image: string
    author: string
    date: string
  }

  definePageMeta({
    layout: 'no-footer',
  })

  const route = useRoute()
  const api = useAPI()

  const storySlug = route.params.slug as string
  const story = ref<Story | null>(null)
  const storyPages = ref<StoryPage[]>([])
  const storyContent = ref<StoryContent | null>(null)
  const currentPageIndex = ref(0)
  const isLightboxOpen = ref(false)
  const currentLightboxImage = ref('')
  const currentLightboxAlt = ref('')

  // Fetch story data by slug
  const { data: storyData } = await api.getStoryBySlug(storySlug)
  if (storyData.value) {
    story.value = storyData.value

    // Fetch story pages
    const { data: pagesData } = await api.getStoryPages(story.value.id)
    if (pagesData.value) {
      storyPages.value = pagesData.value.sort(
        (a, b) => a.page_order - b.page_order
      )

      // Transform the data to match the expected format
      storyContent.value = {
        id: story.value.id,
        title: story.value.title,
        image: storyPages.value[0]?.image || '/imgs/prater/default.jpeg',
        author: story.value.author.name || 'Unknown',
        date: story.value.year.toString(),
      }
    }
  }

  const currentPage = computed(() => {
    return storyPages.value[currentPageIndex.value]
  })

  const topImageMasksIndexes = storyPages.value.map(() => {
    return Math.floor(Math.random() * 3) + 1
  })

  const bottomImageMasksIndexes = storyPages.value.map(() => {
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

  function handleImageClick(imageSrc: string, alt: string) {
    currentLightboxImage.value = imageSrc
    currentLightboxAlt.value = alt
    isLightboxOpen.value = true
  }

  function handleLightboxClose() {
    isLightboxOpen.value = false
  }
</script>

<template>
  <div>
    <div
      v-if="storyContent"
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
            :src="storyContent.image"
            alt="Story image"
            @click="handleImageClick(storyContent.image, storyContent.title)"
          />
          <div
            class="story-title-container"
            :class="{
              'top-aligned': currentPage?.layout === 'text-over-image',
            }"
          >
            <h1>{{ storyContent.title }}</h1>
            <p>{{ storyContent.date }}</p>
            <p>
              Eine Geschichte von
              <span class="author-name">{{ storyContent.author }}</span>
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
            :alt="storyContent?.title || ''"
            @click="
              handleImageClick(
                currentPage?.image || '',
                storyContent?.title || ''
              )
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
          type="secondary"
          variant="icon"
          icon="mdi-arrow-left"
          class="close-button"
          @click="$router.back()"
        />
        <div class="pagination">
          <button
            v-for="(page, index) in storyPages"
            :key="page.id"
            @click="currentPageIndex = index"
          >
            <span :class="{ active: currentPageIndex === index }" />
          </button>
        </div>
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

  .top-decoration {
    width: calc(100% + var(--padding-mobile) * 4);
    height: auto;
    max-height: 200px;
    margin-left: calc(var(--padding-mobile) * -1 * 2);
    object-fit: cover;
  }

  .copyright {
    display: block;
    font-size: 0.8rem;
  }

  .bottom-controls {
    display: grid;
    flex-shrink: 0; /* Prevent bottom controls from shrinking */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    .close-button {
      width: 40px;
    }

    .pagination {
      display: flex;
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
