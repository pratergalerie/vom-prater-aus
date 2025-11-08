<script lang="ts" setup>
  import type { StrapiImage } from '~~/types/strapi'
  import type { ListElement } from './StoriesGridElement.vue'
  import StoriesGridElement from './StoriesGridElement.vue'
  import { getStrapiImageUrl } from '~/utils/strapi'

  const props = defineProps<{
    maxItems?: number
    layout?: 'default' | 'inline'
    excludeSlug?: string
    randomize?: boolean
  }>()

  const selectedKeywords = ref<string[]>([])
  provide('selectedKeywords', selectedKeywords)

  const isInlineLayout = computed(() => props.layout === 'inline')

  const handleKeywordClick = async (name: string, selected: boolean) => {
    // Disable keyword filtering in inline layout
    if (isInlineLayout.value) return

    if (selected) {
      selectedKeywords.value.push(name)
    } else {
      selectedKeywords.value = selectedKeywords.value.filter(
        (keyword) => keyword !== name
      )
    }
  }

  const {
    data: storiesData,
    status,
    error,
  } = await useGetStories({ keywords: selectedKeywords })

  const initialStories = computed(() => {
    return storiesData.value
      .filter((story) => {
        // Filter out the excluded story
        if (props.excludeSlug && story.slug === props.excludeSlug) {
          return false
        }
        return true
      })
      .map<(ListElement & { id: string }) | undefined>((story) => {
        // Use the first section (cover)
        const firstSection = story.sections[0]
        const keywords = story.keywords.map((keyword) => ({
          name: keyword.name,
          id: keyword.documentId,
          selected: isInlineLayout.value
            ? false
            : selectedKeywords.value.includes(keyword.name),
        }))

        if (firstSection?.image !== null && firstSection?.image !== undefined) {
          return {
            variant: 'image',
            id: story.documentId,
            img: {
              src: getStrapiImageUrl((firstSection.image as StrapiImage).url),
              alt: (firstSection.image as StrapiImage).alternativeText ?? '',
            },
            text: null,
            title: story.title,
            link: `/stories/${story.slug}`,
            year: story.year.toString(),
            author: story.authorName,
            keywords: keywords,
            onKeywordClick: handleKeywordClick,
          }
        }

        if (firstSection?.text !== null && firstSection?.text !== undefined) {
          const previewText = `${firstSection.text?.split(/\s+/).slice(0, 40).join(' ')}...`

          return {
            variant: 'text',
            id: story.documentId,
            img: null,
            text: previewText,
            title: story.title,
            link: `/stories/${story.slug}`,
            year: story.year.toString(),
            author: story.authorName,
            keywords: keywords,
            onKeywordClick: handleKeywordClick,
          }
        }

        return undefined
      })
      .filter((story) => story !== undefined)
  })

  const stories = ref(initialStories.value)

  // Randomize only on client side to avoid hydration mismatch
  onMounted(() => {
    if (props.randomize) {
      stories.value = [...initialStories.value].sort(() => Math.random() - 0.5)
    }
  })

  // Watch for changes in initialStories (e.g., when keywords change)
  watch(initialStories, (newStories) => {
    if (props.randomize) {
      stories.value = [...newStories].sort(() => Math.random() - 0.5)
    } else {
      stories.value = newStories
    }
  })

  const displayedStories = computed(() => {
    return props.maxItems
      ? stories.value.slice(0, props.maxItems)
      : stories.value
  })
</script>

<template>
  <!-- Loading state -->
  <p v-if="status === 'pending'">
    {{ $t('pages.stories.index.loading') }}
  </p>

  <!-- Error state -->
  <p
    v-else-if="error"
    class="error"
  >
    {{ $t('pages.stories.index.error') }}
  </p>

  <!-- No stories state -->
  <p v-else-if="displayedStories.length === 0">
    {{ $t('pages.stories.index.noStories') }}
  </p>

  <div
    v-else
    class="stories-grid"
    :class="{ 'inline-layout': isInlineLayout }"
  >
    <StoriesGridElement
      v-for="story in displayedStories"
      :key="story.id"
      :variant="story.variant"
      :title="story.title"
      :img="story.img"
      :text="story.text"
      :link="story.link"
      :year="story.year"
      :author="story.author"
      :keywords="story.keywords"
      :on-keyword-click="handleKeywordClick"
      :show-keywords="!isInlineLayout"
    />
  </div>
</template>

<style scoped>
  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-2xl-3xl) var(--space-l);
    padding-top: var(--space-l);

    /* Make left column items have a Y offset */
    & div:nth-child(2n + 1) {
      margin-top: var(--space-l);
    }

    &.inline-layout {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

      /* Remove Y offset for inline layout */
      & div:nth-child(2n + 1) {
        margin-top: 0;
      }

      /* Force 3 columns on larger screens */
      @media (min-width: 1000px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
</style>
