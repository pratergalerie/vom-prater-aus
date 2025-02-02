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
  layout: LayoutTypes
  text?: string
  image?: string
}

export enum LayoutTypes {
  TEXT = 'text',
  IMAGE = 'image',
  TEXT_OVER_IMAGE = 'text-over-image',
  IMAGE_OVER_TEXT = 'image-over-text',
}

export type Keyword = {
  id: string
  word: string
}
