import { defineStore } from 'pinia'
import type { Story, StoryPage } from '~/types/frontend'

export const useStoryStore = defineStore('story', () => {
  const localforage = useNuxtApp().$localForage as LocalForage

  // Private state
  const _story = ref<Story | null>(null)
  const _currentPageIndex = ref(0)
  const _error = ref<string | null>(null)

  // Getters
  const story = computed<Story | null>(() => _story.value)
  const currentPageIndex = computed(() => _currentPageIndex.value)
  const currentPage = computed(
    () => _story.value?.pages[_currentPageIndex.value]
  )
  const hasStory = computed(() => !!_story.value)
  const error = computed(() => _error.value)

  // Watch for changes and auto-save to IndexedDB
  watch(
    _story,
    async (newStory) => {
      if (!newStory) return
      try {
        await saveToIndexedDB(newStory)
      } catch (err) {
        console.error('Error saving to IndexedDB:', err)
        _error.value = 'Failed to save story locally'
      }
    },
    { deep: true }
  )

  // IndexedDB Operations
  async function saveToIndexedDB(story: Story) {
    try {
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
          modifiedAt: page.modifiedAt?.toISOString() || null,
          pageOrder: page.pageOrder,
        })),
        createdAt: story.createdAt.toISOString(),
        locale: story.locale,
        status: story.status || 'draft',
        featured: story.featured || false,
        featuredImage: story.featuredImage || null,
        quote: story.quote || null,
      }

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
      const loadedStory = await localforage.getItem<Story>(storyId)
      if (!loadedStory) return null

      return {
        ...loadedStory,
        createdAt: new Date(loadedStory.createdAt),
        pages: loadedStory.pages.map((page) => ({
          id: page.id,
          layout: page.layout,
          text: page.text,
          image: page.image,
          createdAt: page.createdAt ? new Date(page.createdAt) : undefined,
          modifiedAt: page.modifiedAt ? new Date(page.modifiedAt) : undefined,
          pageOrder: page.pageOrder,
        })),
      } as Story
    } catch (err) {
      console.error('Error loading from IndexedDB:', err)
      return null
    }
  }

  async function deleteFromIndexedDB(storyId: string) {
    try {
      await localforage.removeItem(storyId)
    } catch (err) {
      console.error('Error deleting from IndexedDB:', err)
      throw err
    }
  }

  // Story Operations
  function setStory(storyData: Story) {
    _story.value = storyData
    saveToIndexedDB(_story.value)
  }

  function updateStory(updates: Partial<Story>) {
    if (!_story.value) {
      _error.value = 'No story selected'
      return
    }

    _story.value = {
      ..._story.value,
      ...updates,
    }
    saveToIndexedDB(_story.value)
  }

  // Page Operations
  function addPage(page: StoryPage) {
    if (!_story.value) {
      _error.value = 'No story selected'
      return
    }

    _story.value.pages.push(page)
    saveToIndexedDB(_story.value)
  }

  function updatePage(pageIndex: number, updates: Partial<StoryPage>) {
    if (!_story.value) {
      _error.value = 'No story selected'
      return
    }

    const page = _story.value.pages[pageIndex]
    if (!page) {
      _error.value = 'Page not found'
      return
    }

    _story.value.pages[pageIndex] = { ...page, ...updates }
    saveToIndexedDB(_story.value)
  }

  function deletePage(pageIndex: number) {
    if (!_story.value) {
      _error.value = 'No story selected'
      return
    }

    _story.value.pages.splice(pageIndex, 1)
    saveToIndexedDB(_story.value)
  }

  function deleteStory(storyId: string) {
    if (!storyId) {
      _error.value = 'No story id provided'
      return
    }

    deleteFromIndexedDB(storyId)
    _story.value = null
  }

  function setCurrentPageIndex(index: number) {
    if (!_story.value) {
      _error.value = 'No story selected'
      return
    }

    if (index < 0 || index >= _story.value.pages.length) {
      _error.value = 'Invalid page index'
      return
    }

    _currentPageIndex.value = index
  }

  async function loadStory(storyId: string) {
    _story.value = await loadFromIndexedDB(storyId)
  }

  return {
    // Getters
    story,
    currentPageIndex,
    currentPage,
    hasStory,
    error,

    // Story Operations
    setStory,
    updateStory,
    deleteStory,
    loadStory,

    // Page Operations
    addPage,
    updatePage,
    deletePage,
    setCurrentPageIndex,
  }
})
