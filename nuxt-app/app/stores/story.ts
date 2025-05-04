import { defineStore } from 'pinia'
import type { Story, StoryPage } from '~/types/frontend'

export const useStoryStore = defineStore('story', () => {
  const localforage = useNuxtApp().$localForage as LocalForage

  // State
  const story = ref<Story | null>(null)
  const currentPageIndex = ref(0)
  const error = ref<string | null>(null)

  // Computed
  const hasStory = computed(() => !!story.value)
  const currentPage = computed(() => story.value?.pages[currentPageIndex.value])
  const cachedStory = computed(() => story.value)
  const indexedDBError = computed(() => error.value)

  // Watch for changes and auto-save to IndexedDB
  watch(
    story,
    async (newStory) => {
      if (!newStory) return
      try {
        await saveToIndexedDB(newStory)
      } catch (err) {
        console.error('Error saving to IndexedDB:', err)
        error.value = 'Failed to save story locally'
      }
    },
    { deep: true }
  )

  // IndexedDB Operations
  async function saveToIndexedDB(story: Story) {
    try {
      // Create a serializable copy of the story
      const serializableStory = {
        id: story.id,
        title: story.title,
        author: {
          id: story.author.id,
          name: story.author.name,
          email: story.author.email,
        },
        year: story.year,
        keywords: [...story.keywords],
        pages: story.pages.map((page) => ({
          id: page.id,
          layout: page.layout,
          text: page.text,
          image: page.image,
          createdAt: page.createdAt?.toISOString() || null,
        })),
        createdAt: story.createdAt.toISOString(),
        locale: story.locale,
        status: story.status || 'draft',
        featured: story.featured || false,
        featuredImage: story.featuredImage || null,
        quote: story.quote || null,
      }

      // Debug: Check if the object is serializable
      try {
        JSON.stringify(serializableStory)
      } catch (err) {
        console.error('Non-serializable data found:', err)
        throw err
      }

      await localforage.setItem(story.id, serializableStory)
    } catch (err) {
      console.error('Error saving to IndexedDB:', err)
      throw err
    }
  }

  async function loadFromIndexedDB(storyId: string): Promise<Story | null> {
    try {
      // Try loading with both key formats
      const loadedStory = await localforage.getItem<Story>(storyId)

      if (!loadedStory) return null

      // Convert ISO strings back to Date objects
      return {
        ...loadedStory,
        createdAt: new Date(loadedStory.createdAt),
        pages: loadedStory.pages.map((page) => ({
          ...page,
          createdAt: page.createdAt ? new Date(page.createdAt) : undefined,
        })),
      } as Story
    } catch (err) {
      console.error('Error loading from IndexedDB:', err)
      return null
    }
  }

  async function deleteFromIndexedDB(storyId: string) {
    try {
      // Try deleting with both key formats
      await localforage.removeItem(storyId)
    } catch (err) {
      console.error('Error deleting from IndexedDB:', err)
      throw err
    }
  }

  // Story Operations
  function setStory(storyData: Story) {
    story.value = storyData
    saveToIndexedDB(story.value)
  }

  function updateStory(updates: Partial<Story>) {
    if (!story.value) {
      error.value = 'No story selected'
      return
    }

    story.value = {
      ...story.value,
      ...updates,
    }
    saveToIndexedDB(story.value)
  }

  // Page Operations
  function addPage(page: StoryPage) {
    if (!story.value) {
      error.value = 'No story selected'
      return
    }

    story.value.pages.push(page)
    saveToIndexedDB(story.value)
  }

  function updatePage(pageIndex: number, updates: Partial<StoryPage>) {
    if (!story.value) {
      error.value = 'No story selected'
      return
    }

    const page = story.value.pages[pageIndex]
    if (!page) {
      error.value = 'Page not found'
      return
    }

    story.value.pages[pageIndex] = { ...page, ...updates }
    saveToIndexedDB(story.value)
  }

  function deletePage(pageIndex: number) {
    if (!story.value) {
      error.value = 'No story selected'
      return
    }

    story.value.pages.splice(pageIndex, 1)
    saveToIndexedDB(story.value)
  }

  /**
   * Deletes a story from IndexedDB
   */
  function deleteStory(storyId: string) {
    if (!storyId) {
      error.value = 'No story id provided'
      return
    }

    deleteFromIndexedDB(storyId)
    story.value = null
  }

  /**
   * Sets the current page index
   * @param index - The index of the page to set
   */
  function setCurrentPage(index: number) {
    if (!story.value) {
      error.value = 'No story selected'
      return
    }

    if (index < 0 || index >= story.value.pages.length) {
      error.value = 'Invalid page index'
      return
    }

    currentPageIndex.value = index
  }

  /**
   * Loads a story from IndexedDB (if it exists)
   * @param storyId - The ID of the story to load
   */
  async function loadStory(storyId: string) {
    story.value = await loadFromIndexedDB(storyId)
  }

  return {
    // State
    story,
    currentPageIndex,

    // Computed
    hasStory,
    currentPage,
    cachedStory,
    indexedDBError,

    // Story Operations
    setStory,
    updateStory,
    deleteStory,
    loadStory,

    // Page Operations
    addPage,
    updatePage,
    deletePage,
    setCurrentPage,
  }
})
