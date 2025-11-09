import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Keyword } from '~~/types/strapi'

export const useGetKeywords = async () => {
  const { find } = useStrapi()

  const { data, pending, error, status } = await useAsyncData(
    'keywords',
    () => {
      return find<Strapi5ResponseData<Keyword>>('keywords', {
        filters: {
          stories: {
            // @ts-expect-error: strapi's type system can't narrow this down currently
            documentId: {
              $notNull: true,
            },
          },
        },
        // @ts-expect-error: strapi's type system can't narrow this down currently
        populate: {
          stories: { populate: '*' },
        },
      })
    }
  )

  return {
    data: computed(() => data.value?.data ?? []),
    pending,
    error,
    status,
  }
}
