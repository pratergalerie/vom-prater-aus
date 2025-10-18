import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

export const useGetDraftStory = async (uuid: string) => {
  const client = useStrapiClient()

  const key = computed(() => {
    return `draft-story-${uuid}`
  })

  const { data, pending, error, status } = await useAsyncData(key, () => {
    return client<{ data: Strapi5ResponseData<Story> }>(
      `/draft-stories/${uuid}`
    )
  })

  return {
    data: computed(() => data.value?.data),
    pending,
    error,
    status,
  }
}
