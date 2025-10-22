import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Story } from '~~/types/strapi'

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
>

export const useCreateStory = () => {
  const client = useStrapiClient()
  const pending = ref(false)
  const error = ref(false)

  const postStory = async (data: CreateStory) => {
    pending.value = true
    error.value = false

    try {
      const { uuid } = data
      const response = await client<{ data: Strapi5ResponseData<Story> }>(
        '/stories?status=draft',
        {
          method: 'POST',
          body: { data },
        }
      )
      return { ...response.data, uuid }
    } catch (e) {
      error.value = true
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
