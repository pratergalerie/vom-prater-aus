import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const storyId = event?.context?.params?.id
    const pageId = event?.context?.params?.pageId

    if (!storyId || !pageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Story ID and Page ID are required',
      })
    }

    // Handle PUT request - Update story page
    if (event.method === 'PUT') {
      const body = await readBody(event)

      // Validate page order
      if (body.page_order !== undefined) {
        // Get all pages for this story
        const { data: pages, error: pagesError } = await client
          .from('story_pages')
          .select('id, page_order')
          .eq('story_id', storyId)
          .order('page_order', { ascending: true })

        if (pagesError) {
          console.error('Supabase error:', pagesError)
          throw createError({
            statusCode: Number(pagesError.code),
            statusMessage: pagesError.message,
          })
        }

        // Check if the new page order is valid
        if (body.page_order < 1 || body.page_order > pages.length) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid page order',
          })
        }

        // Update other pages' order if needed
        const currentPage = pages.find((p) => p.id === pageId)
        if (currentPage && currentPage.page_order !== body.page_order) {
          // Shift other pages' order
          const start = Math.min(currentPage.page_order, body.page_order)
          const end = Math.max(currentPage.page_order, body.page_order)
          const direction = currentPage.page_order < body.page_order ? -1 : 1

          for (const page of pages) {
            if (
              page.id !== pageId &&
              page.page_order >= start &&
              page.page_order <= end
            ) {
              await client
                .from('story_pages')
                .update({ page_order: page.page_order + direction })
                .eq('id', page.id)
                .eq('story_id', storyId)
            }
          }
        }
      }

      const { data, error } = await client
        .from('story_pages')
        .update({ ...body, modified_at: new Date().toISOString() })
        .eq('id', pageId)
        .eq('story_id', storyId)
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
