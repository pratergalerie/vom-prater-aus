import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

type Options = {
  featured?: boolean
  keywords?: Ref<string[], string[]>
}

export const useGetStories = async (options?: Options) => {
  const { featured, keywords } = options ?? {}
  const { find } = useStrapi()
  // const { locale } = useI18n()

  const key = computed(() => {
    const keywordsPart = keywords?.value?.length
      ? `-keywords-${keywords.value.join(',')}`
      : ''
    const featuredPart = featured ? '-featured' : ''
    return `stories${keywordsPart}${featuredPart}`
  })

  const { data, pending, error, status } = await useAsyncData(
    key,
    () => {
      const featuredFilter = featured ? { featured: { $eq: featured } } : {}
      const keywordsFilter = keywords
        ? { keywords: { name: { $in: keywords.value } } }
        : {}

      return find<Strapi5ResponseData<Story>>('stories', {
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
          // language: { $eq: locale.value },
        },
        sort: ['createdAt:asc'],
        populate: {
          sections: { populate: '*' },
          keywords: { fields: ['name', 'documentId'] },
        },
      })
    },
    {
      watch: keywords ? [keywords] : [],
    }
  )

  return {
    data: computed(() => data.value?.data ?? []),
    pending,
    error,
    status,
  }
}
