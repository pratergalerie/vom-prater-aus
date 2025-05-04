import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Story ID is required',
      })
    }

    // Validate that the ID is a UUID
    if (!UUID_REGEX.test(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid story ID format',
      })
    }

    // Handle GET request - Get story by ID
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
          ),
          pages:story_pages(
            id,
            layout,
            text,
            image,
            page_order,
            created_at
          ),
          locale:locale_id (
            id,
            code,
            name
          ),
          keywords:stories_keywords(
            keyword_id (
              id,
              word
            )
          )
        `
        )
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
          statusMessage: 'Story not found',
        })
      }

      return data
    }

    // Handle PUT request - Update story
    if (event.method === 'PUT') {
      const body = await readBody(event)

      const { data, error } = await client
        .from('stories')
        .update(body)
        .eq('id', id)
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
          ),
          locale:locale_id (
            id,
            code,
            name
          ),
          pages:story_pages(
            id,
            layout,
            text,
            image,
            created_at,
            modified_at
          ),
          keywords:stories_keywords(
            keyword_id (
              id,
              word
            )
          )
        `
        )

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      return data
    }

    // Handle DELETE request - Delete story
    if (event.method === 'DELETE') {
      const { data, error } = await client
        .from('stories')
        .delete()
        .eq('id', id)
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
          ),
          locale:locale_id (
            id,
            code,
            name
          ),
          keywords:stories_keywords(
            keyword_id (
              id,
              word
            )
          )
          pages:story_pages(
            id,
            layout,
            text,
            image,
            created_at,
            modified_at
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
