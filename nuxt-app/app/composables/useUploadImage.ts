import type {} from '@nuxtjs/strapi'
import type { StrapiImage } from '~~/types/strapi'
import imageCompression from 'browser-image-compression'
import slugify from '@sindresorhus/slugify'

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
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 2400,
        initialQuality: 0.9,
      })

      const lastDotIndex = compressedFile.name.lastIndexOf('.')
      const name = compressedFile.name.substring(0, lastDotIndex)
      const extension = compressedFile.name.substring(lastDotIndex)
      const sanitizedName = slugify(name) + extension

      const formData = new FormData()
      formData.append('files', compressedFile, sanitizedName)

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
