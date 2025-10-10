import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

export const useGetStories = async ({ featured }: { featured: boolean }) => {
  const { find } = useStrapi()
  const { locale } = useI18n()

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
        filters: {
          featured: { $eq: featured },
          language: { $eq: locale.value },
        },
        sort: ['createdAt:asc'],
        populate: { pages: { populate: 'image' } },
      })
  )

  return { data, pending, error, status }
}
