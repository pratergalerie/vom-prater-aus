import { defineStore } from 'pinia'
import type { Story } from '~/types'

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
      keywords: [],
      pages: [
        {
          id: '0',
          layout: 'image-over-text',
          text: 'Example text',
          image: undefined,
        },
      ],
      createdAt: new Date(),
    })

    return {
      story,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  }
)
