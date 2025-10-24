import type {} from '@nuxtjs/strapi'
import type { StrapiImage } from '~~/types/strapi'

type StrapiResponse = StrapiImage[]

type Result<T> = { type: 'error'; error: Error } | { type: 'ok'; data: T }

export const useUploadImage = () => {
  const client = useStrapiClient()
  const pending = ref(false)
  const error = ref(false)

  const uploadImage = async (
    file: File
  ): Promise<Result<StrapiImage | undefined>> => {
    pending.value = true
    error.value = false

    try {
      const formData = new FormData()
      formData.append('files', file, file.name)

      const response = await client<StrapiResponse>('upload', {
        method: 'POST',
        body: formData,
      })

      return { type: 'ok', data: response[0] }
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
    upload: uploadImage,
    pending,
    error,
  }
}
