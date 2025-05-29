import type { Story, PageLayout, StoryPage } from '~/types/frontend'
import type { Tables } from '~/types/supabase'

type BackendStoryPage = Tables<'story_pages'>
type BackendStoryLocale = Pick<Tables<'locales'>, 'id' | 'code' | 'name'>
type BackendStoryAuthor = Pick<Tables<'authors'>, 'id' | 'name' | 'email'>
type BackendKeyword = {
  keyword: Pick<Tables<'keywords'>, 'id' | 'word'>
}
type BackendStory = Omit<Tables<'stories'>, 'author_id' | 'locale_id'> & {
  author: BackendStoryAuthor
  locale: BackendStoryLocale
  keywords?: BackendKeyword[]
  pages?: BackendStoryPage[]
}

/**
 * Converts a backend story page to frontend format
 * @param page Backend story page data
 * @returns Frontend story page data
 */
export function transformStoryPage(page: BackendStoryPage): StoryPage {
  return {
    id: page.id,
    layout: page.layout as PageLayout,
    text: page.text,
    image: page.image,
    createdAt: page.created_at ? new Date(page.created_at) : undefined,
    modifiedAt: page.modified_at ? new Date(page.modified_at) : undefined,
    pageOrder: page.page_order,
  }
}

/**
 * Converts backend story data to frontend format
 * @param backendStory Backend story data
 * @returns Frontend story data
 */
export function transformStoryData(backendStory: BackendStory): Story {
  return {
    id: backendStory.id,
    title: backendStory.title,
    slug: backendStory.slug,
    author: {
      id: backendStory.author.id,
      name: backendStory.author.name,
      email: backendStory.author.email,
    },
    year: backendStory.year,
    keywords:
      backendStory.keywords?.map((k) => ({
        id: k.keyword.id,
        word: k.keyword.word,
      })) || [],
    pages:
      backendStory.pages
        ?.map(transformStoryPage)
        .sort((a, b) => (a.pageOrder || 0) - (b.pageOrder || 0)) || [],
    createdAt: new Date(backendStory.created_at || new Date()),
    modifiedAt: backendStory.modified_at
      ? new Date(backendStory.modified_at)
      : null,
    locale: backendStory.locale.code as 'en' | 'de',
    status: backendStory.status as Story['status'],
    featured: backendStory.featured || false,
    featuredImage: backendStory.featured_image,
    quote: backendStory.quote,
  }
}
