<script lang="ts" setup>
  import type { ListElement } from './StoriesGridElement.vue'
  import StoriesGridElement from './StoriesGridElement.vue'

  const selectedKeywords = ref<string[]>([])
  provide('selectedKeywords', selectedKeywords)

  const handleKeywordClick = async (name: string, selected: boolean) => {
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

  const { strapiUrl } = useRuntimeConfig().public

  const stories = computed(() =>
    storiesData.value.map<ListElement & { id: string }>((story) => {
      // Check if featured story has any images
      const storyWithImage = story.pages.find((story) => story.image !== null)
      const hasImage = storyWithImage !== undefined
      const image = hasImage
        ? {
            src: `${strapiUrl}${storyWithImage?.image.url}`,
            alt: storyWithImage?.image.alternativeText ?? '',
          }
        : undefined

      const keywords = story.keywords.map((keyword) => ({
        name: keyword.name,
        id: keyword.documentId,
        selected: selectedKeywords.value.includes(keyword.name),
      }))

      return {
        id: story.documentId,
        img: image,
        title: story.title,
        link: `/stories/${story.slug}`,
        year: story.year.toString(),
        author: story.authorName,
        keywords: keywords,
        onKeywordClick: handleKeywordClick,
      }
    })
  )
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
  <p v-else-if="stories.length === 0">
    {{ $t('pages.stories.index.noStories') }}
  </p>

  <div
    v-for="story in stories"
    :key="story.id"
    class="stories-grid"
  >
    <StoriesGridElement
      :title="story.title"
      :img="story.img"
      :link="story.link"
      :year="story.year"
      :author="story.author"
      :keywords="story.keywords"
      :on-keyword-click="handleKeywordClick"
    />
  </div>
</template>

<style scoped>
  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 4rem 2rem;

    /* Make left column items have a Y offset */
    & div:nth-child(2n + 1) {
      margin-top: 2rem;
    }
  }

  .error {
    color: var(--color-error);
  }
</style>
