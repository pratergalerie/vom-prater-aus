import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const slug = event.context.params?.slug

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Story slug is required',
      })
    }

    // Handle GET request - Get story by slug
    if (event.method === 'GET') {
      const { data, error } = await client
        .from('stories')
        .select(
          `
          id,
          title,
          slug,
          year,
          status,
          featured_image,
          quote,
          featured,
          created_at,
          modified_at,
          author:author_id (
            id,
            name,
            email
          )
        `
        )
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      if (!data) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Story not found',
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
