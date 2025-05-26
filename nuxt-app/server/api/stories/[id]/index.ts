import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const storyId = event.context.params?.id

    if (!storyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Story ID is required',
      })
    }

    // Validate that the ID is a UUID
    if (!UUID_REGEX.test(storyId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid story ID format',
      })
    }

    // Handle GET request - Get single story
    if (event.method === 'GET') {
      const query = getQuery(event)
      const isAdmin = query.admin === 'true'

      let supabaseQuery = client
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
          locale:locale_id (
            id,
            code,
            name
          )
        `
        )
        .eq('id', storyId)

      // For non-admin requests, only return approved stories
      if (!isAdmin) {
        supabaseQuery = supabaseQuery.eq('status', 'approved')
      }

      const { data, error } = await supabaseQuery.single()

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

      // Update story
      const { data: storyData, error: updateError } = await client
        .from('stories')
        .update({
          status: body.status,
          featured: body.featured,
          quote: body.quote,
          modified_at: new Date().toISOString(),
        })
        .eq('id', storyId)
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
          )
        `
        )
        .single()

      if (updateError) {
        throw createError({
          statusCode: Number(updateError.code),
          statusMessage: updateError.message,
        })
      }

      // If status is being updated to approved or rejected, send email notification
      if (body.status === 'approved' || body.status === 'rejected') {
        try {
          const { error: functionError } = await client.functions.invoke(
            'send-moderation-result',
            {
              body: {
                email: storyData.author.email,
                storyId: storyData.id,
                status: body.status,
                storyTitle: storyData.title,
              },
            }
          )

          if (functionError) {
            console.error('Failed to send moderation email:', functionError)
          }
        } catch (error) {
          console.error('Edge Function error:', error)
          // Continue even if email fails
        }
      }

      return storyData
    }

    // Handle DELETE request - Delete story
    if (event.method === 'DELETE') {
      const { data, error } = await client
        .from('stories')
        .delete()
        .eq('id', storyId)
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
