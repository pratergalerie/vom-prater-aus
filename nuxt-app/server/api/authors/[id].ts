import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  console.log('=== Author API Endpoint Called ===')
  console.log('Method:', event.method)
  console.log('URL:', getRequestURL(event))

  try {
    const client = await serverSupabaseClient<Database>(event)
    console.log('Supabase client initialized')

    // Get the author ID from the URL
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Author ID is required',
      })
    }

    // Handle GET request - Get single author
    if (event.method === 'GET') {
      console.log('Processing GET request for author:', id)
      const { data, error } = await client
        .from('authors')
        .select('*')
        .eq('id', id)
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
          statusMessage: 'Author not found',
        })
      }

      return data
    }

    // Handle PUT request - Update author
    if (event.method === 'PUT') {
      console.log('Processing PUT request for author:', id)
      const body = await readBody(event)
      console.log('Request body:', body)

      const { data, error } = await client
        .from('authors')
        .update({
          name: body.name,
          email: body.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
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
          statusMessage: 'Author not found',
        })
      }

      return data
    }

    // Handle DELETE request - Delete author
    if (event.method === 'DELETE') {
      console.log('Processing DELETE request for author:', id)
      const { error } = await client.from('authors').delete().eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      return { success: true }
    }
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
