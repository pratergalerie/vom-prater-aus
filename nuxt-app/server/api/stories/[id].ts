import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const id = getRouterParam(event, 'id')

  // Handle GET request - Get single story
  if (event.method === 'GET') {
    const { data, error } = await client
      .from('stories')
      .select(
        `
        *,
        author:author_id (*),
        pages:story_pages (*),
        keywords:stories_keywords (
          keyword:keyword_id (*)
        )
      `
      )
      .eq('id', id as string)
      .single()

    if (error) {
      throw createError({
        statusCode: Number(error.code),
        statusMessage: error.message,
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
      .eq('id', id as string)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: Number(error.code),
        statusMessage: error.message,
      })
    }

    return data
  }

  // Handle DELETE request - Delete story
  if (event.method === 'DELETE') {
    const { error } = await client
      .from('stories')
      .delete()
      .eq('id', id as string)

    if (error) {
      throw createError({
        statusCode: Number(error.code),
        statusMessage: error.message,
      })
    }

    return { success: true }
  }
})
