import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - Get all pages
    if (event.method === 'GET') {
      const { data, error } = await client
        .from('pages')
        .select('id, slug, created_at, updated_at')
        .order('slug', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      return data
    }

    // Handle POST request - Create a new page
    if (event.method === 'POST') {
      const body = await readBody(event)

      if (!body.slug) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Slug is required',
        })
      }

      const { data, error } = await client
        .from('pages')
        .insert({
          slug: body.slug,
        })
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
