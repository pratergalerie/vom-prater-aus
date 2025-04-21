import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - List all stories
    if (event.method === 'GET') {
      // Get query parameters
      const query = getQuery(event)
      const featured = query.featured === 'true'
      const limit = query.limit ? parseInt(query.limit as string) : undefined

      // Start building the query
      let supabaseQuery = client.from('stories').select(
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

      // Apply featured filter if specified
      if (featured) {
        supabaseQuery = supabaseQuery.eq('featured', true)
      }

      // Apply limit if specified
      if (limit) {
        supabaseQuery = supabaseQuery.limit(limit)
      }

      // Apply ordering
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false })

      // Execute the query
      const { data, error } = await supabaseQuery

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      return data
    }

    // Handle POST request - Create new story
    if (event.method === 'POST') {
      const body = await readBody(event)

      const { data, error } = await client
        .from('stories')
        .insert(body)
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
