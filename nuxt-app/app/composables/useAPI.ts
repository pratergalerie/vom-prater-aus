import type { Database } from '~/types/supabase'

// Define a return type for stories
type Story = Omit<
  Database['public']['Tables']['stories']['Row'],
  'author_id' | 'locale_id'
> & {
  author: Database['public']['Tables']['authors']['Row']
  pages: Database['public']['Tables']['story_pages']['Row'][]
  locale: Pick<
    Database['public']['Tables']['locales']['Row'],
    'id' | 'code' | 'name'
  >
  keywords: {
    keyword: {
      id: string
      word: string
    }
  }[]
}

type PageResponse = Database['public']['Tables']['story_pages']['Row']

export function useAPI() {
  /**
   * Fetches all stories, optionally filtered by admin mode
   * @param {Object} options - Additional options
   * @param {boolean} options.admin - Whether to fetch in admin mode (default: false) - this will return all stories, including draft and submitted stories
   * @returns {Promise<{ data: Ref<Story[]>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the stories data and loading states
   */
  function getStories(options?: { admin?: boolean }) {
    return useFetch<Story[]>('/api/stories', {
      params: {
        admin: options?.admin ? 'true' : undefined,
      },
    })
  }

  /**
   * Fetches all stories, optionally filtered by admin mode
   * @param {Object} options - Additional options
   * @param {boolean} options.admin - Whether to fetch in admin mode (default: false) - this will return all stories, including draft and submitted stories
   * @returns {Promise<Story[]>} A promise containing the stories data
   */
  function fetchStories(options?: { admin?: boolean }) {
    return $fetch<Story[]>('/api/stories', {
      params: {
        admin: options?.admin ? 'true' : undefined,
      },
    })
  }

  /**
   * Fetches featured stories
   * @param {number} [limit] - Optional limit for the number of stories to fetch
   * @returns {Promise<{ data: Ref<Story[]>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the featured stories data and loading states
   */
  function getFeaturedStories(limit?: number) {
    return useFetch<Story[]>('/api/stories', {
      params: {
        featured: 'true',
        limit: limit || undefined,
      },
    })
  }

  /**
   * Fetches a single story by its ID. This is an isomorphic method that works on both server and client.
   * Use this method in component setup or page data fetching.
   * @param {string} id - The ID of the story to fetch
   * @param {Object} options - Additional options
   * @param {boolean} options.admin - Whether to fetch in admin mode
   * @param {string} options.token - Story token for author access
   * @param {boolean} options.pages - Whether to fetch story pages
   * @returns {Promise<{ data: Ref<Story>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the story data and loading states
   */
  function getStoryById(
    id: string,
    options?: { admin?: boolean; token?: string | null; pages?: boolean }
  ) {
    return useFetch<Story>(`/api/stories/${id}`, {
      params: {
        admin: options?.admin ? 'true' : undefined,
        token: options?.token || undefined,
        pages: options?.pages ? 'true' : undefined,
      },
    })
  }

  /**
   * Imperatively fetches a story by ID. This is a client-only method.
   * Use this method for user interactions and client-side effects.
   * @param {string} id - The ID of the story to fetch
   * @param {Object} options - Additional options
   * @param {boolean} options.admin - Whether to fetch in admin mode
   * @param {string} options.token - Story token for author access
   * @param {boolean} options.pages - Whether to fetch story pages
   * @returns {Promise<Story>} A promise containing the story data
   */
  function fetchStoryById(
    id: string,
    options?: { admin?: boolean; token?: string | null; pages?: boolean }
  ) {
    return $fetch<Story>(`/api/stories/${id}`, {
      params: {
        admin: options?.admin ? 'true' : undefined,
        token: options?.token || undefined,
        pages: options?.pages ? 'true' : undefined,
      },
    })
  }

  /**
   * Fetches a single story by its slug
   * @param {string} slug - The slug of the story to fetch
   * @returns {Promise<{ data: Ref<Story>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the story data and loading states
   */
  function getStoryBySlug(slug: string, options?: { pages?: boolean }) {
    return useFetch<Story>(`/api/stories/by-slug/${slug}`, {
      params: {
        pages: options?.pages ? 'true' : undefined,
      },
    })
  }

  /**
   * Fetches all pages for a specific story
   * @param {string} storyId - The ID of the story to fetch pages for
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['story_pages']['Row'][]>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the story pages data and loading states
   */
  function getStoryPages(storyId: string) {
    return useFetch<Database['public']['Tables']['story_pages']['Row'][]>(
      `/api/stories/${storyId}/pages`
    )
  }

  function fetchStoryPages(storyId: string) {
    return $fetch<Database['public']['Tables']['story_pages']['Row'][]>(
      `/api/stories/${storyId}/pages`
    )
  }

  /**
   * Creates a new story
   * @param {Database['public']['Tables']['stories']['Insert']} story - The story data to create
   * @returns {Promise<Database['public']['Tables']['stories']['Row']>} A promise containing the created story
   */
  function createStory(
    story: Database['public']['Tables']['stories']['Insert']
  ) {
    return $fetch<Database['public']['Tables']['stories']['Row']>(
      '/api/stories',
      {
        method: 'POST',
        body: story,
      }
    )
  }

  /**
   * Creates a new story with a specific locale
   * @param {Omit<Database['public']['Tables']['stories']['Insert'], 'locale_id'>} story - The story data to create (without locale_id)
   * @param {string} localeCode - The code of the locale to associate with the story
   * @returns {Promise<Database['public']['Tables']['stories']['Row']>} A promise containing the created story
   */
  async function createStoryWithLocale(
    story: Omit<Database['public']['Tables']['stories']['Insert'], 'locale_id'>,
    localeCode: string
  ) {
    try {
      // First get the locale
      const locale = await $fetch<
        Database['public']['Tables']['locales']['Row']
      >(`/api/locales/${localeCode}`)

      if (!locale) {
        throw new Error(`Locale with code ${localeCode} not found`)
      }

      // Create the story with the locale_id
      const storyWithLocale = {
        ...story,
        locale_id: locale.id,
      }

      // Create the story using $fetch
      return await $fetch<Database['public']['Tables']['stories']['Row']>(
        '/api/stories',
        {
          method: 'POST',
          body: storyWithLocale,
        }
      )
    } catch (error) {
      console.error('Error creating story with locale:', error)
      throw error
    }
  }

  /**
   * Updates an existing story
   * @param {string} id - The ID of the story to update
   * @param {Database['public']['Tables']['stories']['Update']} story - The updated story data
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['stories']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the updated story and loading states
   */
  function updateStory(
    id: string,
    story: Database['public']['Tables']['stories']['Update']
  ) {
    return $fetch<Database['public']['Tables']['stories']['Row']>(
      `/api/stories/${id}`,
      {
        method: 'PUT',
        body: story,
      }
    )
  }

  /**
   * Deletes a story
   * @param {string} id - The ID of the story to delete
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['stories']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the deleted story and loading states
   */
  function deleteStory(id: string) {
    return useFetch<Database['public']['Tables']['stories']['Row']>(
      `/api/stories/${id}`,
      {
        method: 'DELETE',
      }
    )
  }

  /**
   * Fetches all authors
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['authors']['Row'][]>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the authors data and loading states
   */
  function getAuthors() {
    return useFetch<Database['public']['Tables']['authors']['Row'][]>(
      '/api/authors'
    )
  }

  /**
   * Fetches a single author by ID
   * @param {string} id - The ID of the author to fetch
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['authors']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the author data and loading states
   */
  function getAuthor(id: string) {
    return useFetch<Database['public']['Tables']['authors']['Row']>(
      `/api/authors/${id}`
    )
  }

  /**
   * Creates a new author
   * @param {Database['public']['Tables']['authors']['Insert']} author - The author data to create
   * @returns {Promise<Database['public']['Tables']['authors']['Row']>} A promise containing the created author
   */
  function createAuthor(
    author: Database['public']['Tables']['authors']['Insert']
  ) {
    return $fetch<Database['public']['Tables']['authors']['Row']>(
      '/api/authors',
      {
        method: 'POST',
        body: author,
      }
    )
  }

  /**
   * Updates an existing author
   * @param {string} id - The ID of the author to update
   * @param {Database['public']['Tables']['authors']['Update']} author - The updated author data
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['authors']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the updated author and loading states
   */
  function updateAuthor(
    id: string,
    author: Database['public']['Tables']['authors']['Update']
  ) {
    return useFetch<Database['public']['Tables']['authors']['Row']>(
      `/api/authors/${id}`,
      {
        method: 'PUT',
        body: author,
      }
    )
  }

  /**
   * Deletes an author
   * @param {string} id - The ID of the author to delete
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['authors']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the deleted author and loading states
   */
  function deleteAuthor(id: string) {
    return useFetch<Database['public']['Tables']['authors']['Row']>(
      `/api/authors/${id}`,
      {
        method: 'DELETE',
      }
    )
  }

  /**
   * Fetches all pages
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['pages']['Row'][]>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the pages data and loading states
   */
  function getPages() {
    return useFetch<Database['public']['Tables']['pages']['Row'][]>(
      '/api/pages'
    )
  }

  /**
   * Fetches a single page by slug and locale
   * @param {string} slug - The slug of the page to fetch
   * @param {string} locale - The locale code for the page content
   * @returns {Promise<{ data: Ref<PageResponse>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the page data and loading states
   */
  function getPage(slug: string, locale: string) {
    return useFetch<PageResponse>(`/api/pages/${slug}`, {
      params: { locale },
    })
  }

  /**
   * Creates a new page
   * @param {Database['public']['Tables']['story_pages']['Insert']} page - The page data to create
   * @returns {Promise<Database['public']['Tables']['story_pages']['Row']>} A promise containing the created page
   */
  function createPage(
    page: Database['public']['Tables']['story_pages']['Insert']
  ) {
    return $fetch<Database['public']['Tables']['story_pages']['Row']>(
      `/api/stories/${page.story_id}/pages`,
      {
        method: 'POST',
        body: page,
      }
    )
  }

  /**
   * Updates an existing page
   * @param {string} slug - The slug of the page to update
   * @param {string} locale - The locale code for the page content
   * @param {Array<{ id: string, content: { id: string, title: string | null, subtitle: string | null, text: string[] | null, imageSrc: string | null, imageAlt: string | null, buttonLabel: string | null, buttonLink: string | null, additionalContent: Record<string, unknown> | null } }>} sections - The updated page sections
   * @returns {Promise<{ success: boolean }>} A promise containing the update status
   */
  function updatePage(
    slug: string,
    locale: string,
    sections: {
      id: string
      content: {
        id: string
        title: string | null
        subtitle: string | null
        text: string[] | null
        imageSrc: string | null
        imageAlt: string | null
        buttonLabel: string | null
        buttonLink: string | null
        additionalContent: Record<string, unknown> | null
      }
    }[]
  ) {
    return $fetch<{ success: boolean }>(`/api/pages/${slug}`, {
      method: 'PUT',
      body: { sections },
      params: { locale },
    })
  }

  /**
   * Fetches a locale by its code
   * @param {string} localeCode - The code of the locale to fetch
   * @returns {Promise<{ data: Ref<Database['public']['Tables']['locales']['Row']>, pending: Ref<boolean>, error: Ref<Error | null> }>} A promise containing the locale data and loading states
   */
  function getLocale(localeCode: string) {
    return useFetch<Database['public']['Tables']['locales']['Row']>(
      `/api/locales/${localeCode}`
    )
  }

  /**
   * Updates an existing story page
   * @param {string} storyId - The ID of the story
   * @param {string} pageId - The ID of the page to update
   * @param {Database['public']['Tables']['story_pages']['Update']} page - The updated page data
   * @returns {Promise<Database['public']['Tables']['story_pages']['Row']>} A promise containing the updated page
   */
  function updateStoryPage(
    storyId: string,
    pageId: string,
    page: Database['public']['Tables']['story_pages']['Update']
  ) {
    return $fetch<Database['public']['Tables']['story_pages']['Row']>(
      `/api/stories/${storyId}/pages/${pageId}`,
      {
        method: 'PUT',
        body: page,
      }
    )
  }

  /**
   * Deletes a story page
   * @param {string} storyId - The ID of the story
   * @param {string} pageId - The ID of the page to delete
   * @returns {Promise<{ success: boolean }>} A promise containing the deletion status
   */
  function deleteStoryPage(storyId: string, pageId: string) {
    return $fetch<{ success: boolean }>(
      `/api/stories/${storyId}/pages/${pageId}`,
      {
        method: 'DELETE',
      }
    )
  }

  /**
   * Verifies a story password and returns an authentication token
   * @param {string} storyId - The ID of the story to verify
   * @param {string} password - The password to verify
   * @returns {Promise<{ token: string }>} A promise containing the authentication token
   */
  function verifyStoryPassword(storyId: string, password: string | null) {
    return $fetch<{ token: string }>('/api/stories/verify-password', {
      method: 'POST',
      body: { storyId, password },
    })
  }

  return {
    // Stories
    getStories,
    fetchStories,
    getFeaturedStories,
    getStoryById,
    fetchStoryById,
    getStoryBySlug,
    getStoryPages,
    fetchStoryPages,
    createStory,
    createStoryWithLocale,
    updateStory,
    deleteStory,
    verifyStoryPassword,
    // Authors
    getAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    // Pages
    getPages,
    getPage,
    createPage,
    updatePage,
    updateStoryPage,
    deleteStoryPage,
    // Locales
    getLocale,
  }
}
