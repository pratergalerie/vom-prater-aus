import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - List all stories
    if (event.method === 'GET') {
      const { data, error } = await client
        .from('stories')
        .select(
          `
          id,
          title,
          year,
          created_at,
          modified_at,
          author:author_id (
            id,
            name
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      console.log('Stories data:', data)
      return data
    }

    // Handle POST request - Create new story
    if (event.method === 'POST') {
      const body = await readBody(event)
      console.log('Request body:', body)

      const { data, error } = await client
        .from('stories')
        .insert(body)
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
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
