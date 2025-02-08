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
