<script lang="ts" setup>
  import type { StrapiImage } from '~~/types/strapi'
  import type { ListElement } from './StoriesGridElement.vue'
  import StoriesGridElement from './StoriesGridElement.vue'
  import { getStrapiImageUrl } from '~/utils/strapi'

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

  const stories = computed(() =>
    storiesData.value
      .map<(ListElement & { id: string }) | undefined>((story) => {
        // Use the first section (cover)
        const firstSection = story.sections[0]
        const keywords = story.keywords.map((keyword) => ({
          name: keyword.name,
          id: keyword.documentId,
          selected: selectedKeywords.value.includes(keyword.name),
        }))

        if (firstSection?.image !== null && firstSection?.image !== undefined) {
          return {
            variant: 'image',
            id: story.documentId,
            img: {
              src: getStrapiImageUrl(
                (firstSection.image as StrapiImage).url
              ),
              alt:
                (firstSection.image as StrapiImage).alternativeText ??
                '',
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
          const previewText =
            firstSection.text
              ?.match(/^.*?[.!?](?=\s|$)/)?.[0]
              .replace(/[.!?]+$/, '...') ?? ''

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
    v-else
    class="stories-grid"
  >
    <StoriesGridElement
      v-for="story in stories"
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
    />
  </div>
</template>

<style scoped>
  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-l);
    padding-top: var(--space-l);

    /* Make left column items have a Y offset */
    & div:nth-child(2n + 1) {
      margin-top: var(--space-l);
    }
  }
</style>
