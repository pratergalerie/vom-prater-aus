import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import bcrypt from 'bcryptjs'

function generateRandomPassword(length = 12) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - List all stories
    if (event.method === 'GET') {
      // Get query parameters
      const query = getQuery(event)
      const featured = query.featured === 'true'
      const pages = query.pages === 'true'
      const limit = query.limit ? parseInt(query.limit as string) : undefined

      // Start building the query
      let supabaseQuery = client.from('stories').select(
        pages
          ? `
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
        keywords:stories_keywords (
            keyword:keyword_id (
              id,
              word
            )
          ),
        pages:story_pages (
          *
        )
      `
          : `
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
        keywords:stories_keywords (
            keyword:keyword_id (
              id,
              word
            )
          )
      `
      )

      // Apply featured filter if specified
      if (featured) {
        supabaseQuery = supabaseQuery.eq('featured', true)
      }

      // Filter by status based on admin parameter
      const isAdmin = query.admin === 'true'
      if (isAdmin) {
        // For admin dashboard, show submitted, approved, and rejected stories
        supabaseQuery = supabaseQuery.in('status', [
          'submitted',
          'approved',
          'rejected',
        ])
      } else {
        // For public views, only show approved stories
        supabaseQuery = supabaseQuery.eq('status', 'approved')
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

      // 1. Generate and hash password
      const plainPassword = generateRandomPassword()
      const hash = bcrypt.hashSync(plainPassword, 10)
      body.password = hash

      const { data: storyData, error } = await client
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
          ),
          locale:locale_id (
            id,
            code,
            name
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

      // Transform featured_image URL to use correct Supabase storage URL
      if (storyData.featured_image) {
        const { data } = client.storage
          .from('stories-storage')
          .getPublicUrl(storyData.featured_image)
        storyData.featured_image = data.publicUrl
      }

      // 2. Call the Edge Function to send the email
      try {
        const client = await serverSupabaseClient<Database>(event)
        const { error: functionError } = await client.functions.invoke(
          'send-story-password',
          {
            body: {
              email: storyData.author.email,
              storyId: storyData.id,
              password: plainPassword,
            },
          }
        )

        if (functionError) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Failed to send email',
          })
        }
      } catch (error) {
        console.error('Edge Function error:', error)
        // Still return the data even if email fails
      }

      return storyData
    }
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
