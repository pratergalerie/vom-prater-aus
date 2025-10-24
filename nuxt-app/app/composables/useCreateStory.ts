import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'
import { v4 as uuidv4 } from 'uuid'

type StrapiResponse = { data: Strapi5ResponseData<Story> }

type Result<T> = { type: 'error'; error: Error } | { type: 'ok'; data: T }

type CreateStory = Omit<
  Story,
  | 'documentId'
  | 'createdAt'
  | 'updatedAt'
  | 'publishedAt'
  | 'keywords'
  | 'featured'
  | 'sections'
  | 'quote'
  | 'uuid'
  | 'lifecycleState'
>

export const useCreateStory = () => {
  const client = useStrapiClient()
  const pending = ref(false)
  const error = ref(false)

  const postStory = async (
    data: CreateStory
  ): Promise<Result<StrapiResponse['data']>> => {
    pending.value = true
    error.value = false

    try {
      const uuid = uuidv4()

      const response = await client<StrapiResponse>('/stories?status=draft', {
        method: 'POST',
        body: { data: { ...data, uuid } },
      })
      return { type: 'ok', data: { ...response.data, uuid } }
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
    post: postStory,
    pending,
    error,
  }
}
