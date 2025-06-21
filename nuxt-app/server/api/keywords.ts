import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - Get keywords with usage count
    if (event.method === 'GET') {
      const { data, error } = await client
        .from('keywords')
        .select(
          `
          id,
          word,
          locale:locale_id (
            code
          ),
          stories_keywords!inner (
            story:story_id (
              status
            )
          )
        `
        )
        .eq('stories_keywords.story.status', 'approved')

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      // Count usage for each keyword
      const keywordCounts = data.reduce(
        (acc, keyword) => {
          const word = keyword.word
          if (!acc[word]) {
            acc[word] = {
              id: keyword.id,
              word: keyword.word,
              count: 0,
              locale: keyword.locale.code,
            }
          }
          acc[word].count += keyword.stories_keywords.length
          return acc
        },
        {} as Record<
          string,
          { id: string; word: string; count: number; locale: string }
        >
      )

      // Convert to array and sort by count (descending)
      const sortedKeywords = Object.values(keywordCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Get top 10 most used keywords

      return sortedKeywords
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
