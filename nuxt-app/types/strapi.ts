export type StrapiImage = {
  alternativeText: string | null
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

export type Section = {
  text: string | null
  image: StrapiImage | null
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
  authorName: string
  authorEmail: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  sections: Section[]
  quote: string | null
}
