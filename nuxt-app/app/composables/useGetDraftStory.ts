import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

type StrapiResponse = { data: Strapi5ResponseData<Story> }

export const useGetDraftStory = async (uuid: string) => {
  const client = useStrapiClient()

  const key = computed(() => {
    return `draft-story-${uuid}`
  })

  const { data, pending, error, status, refresh } = await useAsyncData(
    key,
    () => {
      return client<StrapiResponse>(`/draft-stories/${uuid}`)
    }
  )

  return {
    data: computed(() => data.value?.data),
    pending,
    error,
    status,
    refresh,
  }
}
