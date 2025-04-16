import type { Json } from './supabase'

export type Author = {
  id: string
  name: string
  email: string
}

export type Story = {
  id: string
  title: string
  author: Author
  pages: StoryPage[]
  keywords: Keyword[]
  year: number
  createdAt: Date
  modifiedAt?: Date
}

export type StoryPage = {
  id: string
  layout: PageLayout
  text?: string
  image?: string
}

export type PageLayout =
  | 'text'
  | 'image'
  | 'text-over-image'
  | 'image-over-text'

export type Keyword = {
  id: string
  word: string
}

export type Page = {
  id: string
  slug: string
  sections: PageSection[]
}

export type PageSection = {
  id: string
  name: string
  type: string
  order: number
  content: SectionContent
}

export type SectionContent = {
  id: string
  title: string | null
  subtitle: string | null
  text: string[] | null
  imageSrc: string | null
  imageAlt: string | null
  buttonLabel: string | null
  buttonLink: string | null
  additionalContent: Record<string, Json> | null
}
