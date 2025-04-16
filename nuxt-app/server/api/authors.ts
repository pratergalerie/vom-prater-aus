import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - List all authors
    if (event.method === 'GET') {
      const { data, error } = await client
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      return data
    }

    // Handle POST request - Create new author
    if (event.method === 'POST') {
      const body = await readBody(event)

      // Validate required fields
      if (!body.name || !body.email) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name and email are required',
        })
      }

      const { data, error } = await client
        .from('authors')
        .insert({
          name: body.name,
          email: body.email,
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
