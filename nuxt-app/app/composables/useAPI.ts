import type { Database } from '~/types/supabase'

// Define a type for stories with author data
type StoryWithAuthor = Database['public']['Tables']['stories']['Row'] & {
  author: Database['public']['Tables']['authors']['Row']
}

export function useAPI() {
  // Stories methods
  function getStories() {
    return useFetch<StoryWithAuthor[]>('/api/stories')
  }

  function getFeaturedStories(limit?: number) {
    return useFetch<StoryWithAuthor[]>('/api/stories', {
      params: {
        featured: 'true',
        limit: limit || undefined,
      },
    })
  }

  function getStoryById(id: string) {
    return useFetch<StoryWithAuthor>(`/api/stories/${id}`)
  }

  function getStoryBySlug(slug: string) {
    return useFetch<StoryWithAuthor>(`/api/stories/slug/${slug}`)
  }

  function getStoryPages(storyId: string) {
    return useFetch<Database['public']['Tables']['story_pages']['Row'][]>(
      `/api/stories/${storyId}/pages`
    )
  }

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

  function updateStory(
    id: string,
    story: Database['public']['Tables']['stories']['Update']
  ) {
    return useFetch<Database['public']['Tables']['stories']['Row']>(
      `/api/stories/${id}`,
      {
        method: 'PUT',
        body: story,
      }
    )
  }

  function deleteStory(id: string) {
    return useFetch<Database['public']['Tables']['stories']['Row']>(
      `/api/stories/${id}`,
      {
        method: 'DELETE',
      }
    )
  }

  // Authors methods
  function getAuthors() {
    return useFetch<Database['public']['Tables']['authors']['Row'][]>(
      '/api/authors'
    )
  }

  function getAuthor(id: string) {
    return useFetch<Database['public']['Tables']['authors']['Row']>(
      `/api/authors/${id}`
    )
  }

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

  function deleteAuthor(id: string) {
    return useFetch<Database['public']['Tables']['authors']['Row']>(
      `/api/authors/${id}`,
      {
        method: 'DELETE',
      }
    )
  }

  // Pages methods
  function getPages() {
    return useFetch<Database['public']['Tables']['pages']['Row'][]>(
      '/api/pages'
    )
  }

  function getPage(slug: string, locale: string) {
    return useFetch<{
      id: string
      slug: string
      sections: {
        id: string
        name: string
        type: string
        order: number
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
    }>(`/api/pages/${slug}`, {
      params: { locale },
    })
  }

  function createPage(page: Database['public']['Tables']['pages']['Insert']) {
    return $fetch<Database['public']['Tables']['pages']['Row']>('/api/pages', {
      method: 'POST',
      body: page,
    })
  }

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

  return {
    // Stories
    getStories,
    getFeaturedStories,
    getStoryById,
    getStoryBySlug,
    getStoryPages,
    createStory,
    updateStory,
    deleteStory,
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
  }
}
