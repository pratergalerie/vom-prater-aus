export type StrapiImage = {
  alternativeText: string
  caption: string
  createdAt: string
  documentId: string
  ext: '.jpg' | '.png'
  // TODO: better typing
  formats: unknown
  hash: string
  height: number
  id: number
  mime: 'image/jpeg' | 'image/png'
  name: string
  previewUrl: string
  provider: string
  provider_metadata: string
  publishedAt: string
  size: number
  updatedAt: string
  url: string
  width: number
}

export type Language = 'de' | 'en'

export type LifecycleState = 'created' | 'pending' | 'submitted'

export type ReviewState = 'pending' | 'rejected' | 'accepted'

export type Page = {
  text: string
  layout: 'text' | 'image-text' | 'text-image'
  image: StrapiImage
}

export type Keyword = {
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
}

export type Story = {
  documentId: string
  title: string
  slug: string
  uuid: string
  language: Language
  year: number
  keywords: Keyword[]
  featured: boolean
  reviewState: LifecycleState
  authorName: string
  authorEmail?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  pages: Page[]
  quote?: string
}
