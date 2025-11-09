import type { Strapi5ResponseData } from '@nuxtjs/strapi'
import type { Keyword } from '~~/types/strapi'

export const useGetKeywords = async (slug: string) => {
  const { find } = useStrapi()

  const key = computed(() => {
    return `story-${slug}`
  })

  // Fetch all stories to get their keywords
  const { data: storiesData } = await useGetStories()

  const { data, pending, error, status } = await useAsyncData(key, () => {
    return find<Strapi5ResponseData<Keyword>>('keywords')
  })

  // Filter keywords to only include those that are used in at least one story
  const filteredData = computed(() => {
    if (!data.value?.data || !storiesData.value) {
      return data.value?.data
    }

    // Collect all keyword names used in stories
    const usedKeywordNames = new Set<string>()
    storiesData.value.forEach((story) => {
      story.keywords?.forEach((keyword) => {
        if (keyword.name) {
          usedKeywordNames.add(keyword.name)
        }
      })
    })

    // Filter keywords to only those that are used
    return data.value.data.filter((keyword) =>
      usedKeywordNames.has(keyword.name)
    )
  })

  return {
    data: filteredData,
    pending,
    error,
    status,
  }
}
