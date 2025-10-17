import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

export const useGetStory = async (slug: string) => {
  const { findOne } = useStrapi()

  const key = computed(() => {
    return `story-${slug}`
  })

  const { data, pending, error, status } = await useAsyncData(key, () => {
    return findOne<Strapi5ResponseData<Story>>('stories', slug)
  })

  return {
    data: computed(() => data.value?.data),
    pending,
    error,
    status,
  }
}
