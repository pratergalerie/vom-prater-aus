// Frontend types
export type PageLayout =
  | 'image-over-text'
  | 'text-over-image'
  | 'text-only'
  | 'image-only'

export interface Author {
  id: string | null
  name: string
  email: string
}

export interface StoryPage {
  id: string | null
  layout: PageLayout
  text: string | null
  image: string | null
  createdAt?: Date
  modifiedAt?: Date | null
}

export interface Story {
  id: string
  title: string
  author: Author
  year: number
  keywords: string[]
  pages: StoryPage[]
  createdAt: Date
  locale: 'en' | 'de'
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  featuredImage?: string | null
  quote?: string | null
}
