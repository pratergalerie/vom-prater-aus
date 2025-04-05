import type { Database } from '~/types/supabase'

export function useAPI() {
  // Stories methods
  function getStories() {
    return useFetch('/api/stories')
  }

  function getStory(id: string) {
    return useFetch(`/api/stories/${id}`)
  }

  function createStory(
    story: Database['public']['Tables']['stories']['Insert']
  ) {
    return $fetch('/api/stories', {
      method: 'POST',
      body: story,
    })
  }

  function updateStory(
    id: string,
    story: Database['public']['Tables']['stories']['Update']
  ) {
    return useFetch(`/api/stories/${id}`, {
      method: 'PUT',
      body: story,
    })
  }

  function deleteStory(id: string) {
    return useFetch(`/api/stories/${id}`, {
      method: 'DELETE',
    })
  }

  // Authors methods
  function getAuthors() {
    return useFetch('/api/authors')
  }

  function getAuthor(id: string) {
    return useFetch(`/api/authors/${id}`)
  }

  function createAuthor(
    author: Database['public']['Tables']['authors']['Insert']
  ) {
    return $fetch('/api/authors', {
      method: 'POST',
      body: author,
    })
  }

  function updateAuthor(
    id: string,
    author: Database['public']['Tables']['authors']['Update']
  ) {
    return useFetch(`/api/authors/${id}`, {
      method: 'PUT',
      body: author,
    })
  }

  function deleteAuthor(id: string) {
    return useFetch(`/api/authors/${id}`, {
      method: 'DELETE',
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
  }
}
