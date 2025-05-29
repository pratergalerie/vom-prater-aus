import type { Database } from '~/types/supabase'

// Frontend types
export type PageLayout =
  | 'image-over-text'
  | 'text-over-image'
  | 'text'
  | 'image'

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
  modifiedAt?: Date
  pageOrder?: number
}

export interface Story {
  id: string
  title: string
  slug: string
  author: Author
  year: number
  keywords: Keyword[]
  pages: StoryPage[]
  createdAt: Date
  modifiedAt: Date | null
  locale: 'en' | 'de'
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  featured?: boolean
  featuredImage?: string | null
  quote?: string | null
}

export interface Keyword {
  id: string
  word: string
}

// Frontend types
export interface PageSection {
  id: string
  name: string
  type: string
  order: number
  content: PageSectionContent | null
}

export interface PageSectionContent {
  id: string
  title: string | null
  subtitle: string | null
  text: string[] | null
  imageSrc: string | null
  imageAlt: string | null
  buttonLabel: string | null
  buttonLink: string | null
  additionalContent: Database['public']['Tables']['section_content']['Row']['additional_content']
}
