import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story, LifecycleState } from '~~/types/strapi'

type StrapiResponse = { data: Strapi5ResponseData<Story> }

type Result<T> = { type: 'error'; error: Error } | { type: 'ok'; data: T }

type UpdateStory = {
  sections: { text: string | null; image: number | null }[]
  lifecyleState?: LifecycleState
}

export const useUpdateDraftStory = (uuid: string) => {
  const client = useStrapiClient()
  const pending = ref(false)
  const error = ref(false)

  const updateStory = async (
    data: UpdateStory
  ): Promise<Result<StrapiResponse['data']>> => {
    pending.value = true
    error.value = false

    try {
      const response = await client<StrapiResponse>(`/draft-stories/${uuid}`, {
        method: 'PUT',
        body: data,
      })
      return { type: 'ok', data: response.data }
    } catch (e) {
      if (e instanceof Error) {
        error.value = true
        return { type: 'error', error: e }
      } else {
        error.value = true
        return { type: 'error', error: new Error('Unexpected error appeared') }
      }
    } finally {
      pending.value = false
    }
  }

  return {
    update: updateStory,
    pending,
    error,
  }
}
