import { defineStore } from 'pinia'
import type { Story, StoryPage } from '~/types'

export const useStoryStore = defineStore(
  'Story',
  () => {
    const story = ref<Story>({
      id: '0',
      title: 'Test',
      author: {
        id: '0',
        name: 'test',
        email: 'test@test.com',
      },
      year: new Date().getFullYear(),
      keywords: [],
      pages: [
        {
          id: crypto.randomUUID(),
          layout: 'image-over-text',
          text: undefined,
          image: undefined,
        },
      ],
      createdAt: new Date(),
    })

    function updatePage(index: number, updates: Partial<StoryPage>) {
      const currentPage = story.value.pages[index]
      if (!currentPage) return
      story.value.pages[index] = { ...currentPage, ...updates } as StoryPage
    }

    function addPage() {
      story.value.pages.push({
        id: crypto.randomUUID(),
        layout: 'image-over-text',
        text: undefined,
        image: undefined,
      })
    }

    function deletePage(index: number) {
      story.value.pages.splice(index, 1)
    }

    return {
      story,
      updatePage,
      addPage,
      deletePage,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  }
)
