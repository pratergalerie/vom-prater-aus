import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

type Options = {
  featured?: boolean
  keywords?: Ref<string[], string[]>
}

export const useGetStories = async (options?: Options) => {
  const { featured, keywords } = options ?? {}
  const { find } = useStrapi()
  const { locale } = useI18n()

  const featuredFilter = featured ? { featured: { $eq: featured } } : {}
  const keywordsFilter = keywords
    ? { keywords: { name: { $in: keywords } } }
    : {}

  const { data, pending, error, status } = await useAsyncData(
    'allStories',
    () =>
      find<Strapi5ResponseData<Story>>('stories', {
        fields: [
          'authorName',
          'documentId',
          'featured',
          'language',
          'quote',
          'slug',
          'title',
          'year',
        ],
        // @ts-expect-error: strapi's type system can't narrow this down currently
        filters: {
          ...keywordsFilter,
          ...featuredFilter,
          language: { $eq: locale.value },
        },
        sort: ['createdAt:asc'],
        populate: {
          pages: { populate: 'image' },
          keywords: { fields: ['name', 'documentId'] },
        },
      }),
    {
      watch: keywords ? [keywords] : [],
      default: () => ({
        data: [],
      }),
    }
  )

  return { data: data?.value?.data, pending, error, status }
}
