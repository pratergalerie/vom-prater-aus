<script lang="ts" setup>
  import type { StoryPage } from '~/types'

  const { story } = storeToRefs(useStoryStore())

  definePageMeta({
    layout: 'no-footer',
  })

  const currentPageIndex = ref(0)

  const currentPage = computed(
    () => story.value.pages[currentPageIndex.value] as StoryPage
  )
</script>

<template>
  <div class="editor-container">
    <StoryPageEditor
      :page="currentPage"
      :title="story.title"
      :author="story.author.name"
      :date="story.createdAt"
      class="story-editor"
    />
    <div class="page-navigation">
      <BaseButton
        type="secondary"
        variant="icon"
        icon="mdi:arrow-left"
        class="page-navigation-button"
        :class="{ visible: currentPageIndex > 0 }"
        @click="currentPageIndex--"
      />
      <span>Seite {{ currentPageIndex + 1 }}</span>
      <BaseButton
        type="secondary"
        variant="icon"
        icon="mdi:arrow-right"
        class="page-navigation-button"
        :class="{ visible: currentPageIndex < story.pages.length - 1 }"
        @click="currentPageIndex--"
      />
    </div>
  </div>
</template>

<style scoped>
  .editor-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    height: 100dvh;
  }

  .story-editor {
    width: 100%;
    height: 70dvh;
  }

  .page-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;

    .page-navigation-button {
      width: 30px;
      height: 30px;
      opacity: 0;

      &.visible {
        display: block;
      }
    }
  }
</style>
