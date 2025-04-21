import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const storyId = event?.context?.params?.id

    if (storyId) {
      // Handle GET request - List all pages for a story
      if (event.method === 'GET') {
        const { data, error } = await client
          .from('story_pages')
          .select('*')
          .eq('story_id', storyId)
          .order('page_order', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          throw createError({
            statusCode: Number(error.code),
            statusMessage: error.message,
          })
        }

        return data
      }

      // Handle POST request - Create new story page
      if (event.method === 'POST') {
        const body = await readBody(event)

        const { data, error } = await client
          .from('story_pages')
          .insert({ ...body, story_id: storyId })
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw createError({
            statusCode: Number(error.code),
            statusMessage: error.message,
          })
        }

        return data
      }
    } else {
      console.error('Server API error: no story id provided')
    }
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
