import type { Database } from '~/types/supabase'

export function useAPI() {
  // Stories methods
  function getStories() {
    return useFetch<Database['public']['Tables']['stories']['Row'][]>(
      '/api/stories'
    )
  }

  function getStory(id: string) {
    return useFetch<Database['public']['Tables']['stories']['Row']>(
      `/api/stories/${id}`
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

  // Homepage methods
  function getHomepageSections(locale?: string) {
    return useFetch<
      {
        id: string
        section_name: string
        image: string | null
        title: string | null
        paragraph: string | null
        button: {
          label: string | null
          link: string | null
        }
      }[]
    >('/api/homepage', {
      params: locale ? { locale } : undefined,
    })
  }

  function updateHomepageSection(section: {
    section_name: string
    locale: string
    title?: string | null
    paragraph?: string | null
    image?: string | null
    button?: {
      label?: string | null
      link?: string | null
    }
  }) {
    return $fetch<{
      id: string
      section_id: string
      locale_id: string
      title: string | null
      paragraph: string | null
      button_label: string | null
      button_link: string | null
      created_at: string | null
      updated_at: string | null
    }>('/api/homepage', {
      method: 'PUT',
      body: section,
    })
  }

  return {
    // Stories
    getStories,
    getStory,
    createStory,
    updateStory,
    deleteStory,
    // Authors
    getAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    // Homepage
    getHomepageSections,
    updateHomepageSection,
  }
}
