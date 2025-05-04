import type { Story, StoryPage, PageLayout } from '~/types/frontend'
import type { Database } from './supabase'

// Database types
type backendStory = Database['public']['Tables']['stories']['Row']
type backendAuthor = Database['public']['Tables']['authors']['Row']
type backendStoryPage = Database['public']['Tables']['story_pages']['Row']
type backendKeyword = Database['public']['Tables']['keywords']['Row']

/**
 * Converts a backend story to a frontend story
 * @param dbStory - The backend story
 * @param dbAuthor - The backend author
 * @param dbPages - The backend pages
 * @param dbKeywords - The backend keywords
 * @returns The frontend story
 */
export function convertToFrontendStory(
  supabaseStory: backendStory,
  supabaseAuthor: backendAuthor,
  supabasePages: backendStoryPage[],
  supabaseKeywords: backendKeyword[]
): Story {
  return {
    id: supabaseStory.id,
    title: supabaseStory.title,
    author: {
      id: supabaseAuthor.id,
      name: supabaseAuthor.name,
      email: supabaseAuthor.email,
    },
    year: supabaseStory.year,
    keywords: supabaseKeywords.map((k) => k.word),
    pages: supabasePages.map((page) => ({
      id: page.id,
      layout: page.layout as PageLayout,
      text: page.text,
      image: page.image,
    })),
    createdAt: new Date(supabaseStory.created_at || new Date()),
    locale: supabaseStory.locale_id === '1' ? 'en' : 'de',
    status: supabaseStory.status as Story['status'],
    featured: supabaseStory.featured || false,
    featuredImage: supabaseStory.featured_image,
    quote: supabaseStory.quote,
  }
}

/**
 * Converts a frontend story to a backend story
 * @param story - The frontend story
 * @returns The backend story
 */
export function convertToBackendStory(
  story: Story
): Omit<backendStory, 'id' | 'created_at'> {
  return {
    title: story.title,
    author_id: story.author.id || '',
    year: story.year,
    locale_id: story.locale === 'en' ? '1' : '2',
    slug: story.title.toLowerCase().replace(/\s+/g, '-'),
    status: story.status || 'draft',
    featured: story.featured || false,
    featured_image: story.featuredImage || null,
    quote: story.quote || null,
    modified_at: new Date().toISOString(),
  }
}

/**
 * Converts a frontend page to a backend page
 * @param page - The frontend page
 * @param storyId - The story id
 * @returns The backend page
 */
export function convertToBackendPage(
  page: StoryPage,
  storyId: string
): Omit<backendStoryPage, 'id' | 'created_at'> {
  return {
    story_id: storyId,
    layout: page.layout,
    text: page.text,
    image: page.image,
    page_order: 0, // This should be set based on the page's position in the array
  }
}

export function convertToFrontendPage(page: backendStoryPage): StoryPage {
  return {
    id: page.id,
    layout: page.layout as PageLayout,
    text: page.text,
    image: page.image,
  }
}
