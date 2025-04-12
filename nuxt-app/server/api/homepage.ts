import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)

    // Handle GET request - Get all homepage sections with their content
    if (event.method === 'GET') {
      // Get the locale from the query parameter or default to 'en'
      const query = getQuery(event)
      const locale = (query.locale as string) || 'en'

      // First, get the locale ID
      const { data: localeData, error: localeError } = await client
        .from('locales')
        .select('id')
        .eq('code', locale)
        .single()

      if (localeError) {
        console.error('Error fetching locale:', localeError)
        throw createError({
          statusCode: Number(localeError.code),
          statusMessage: localeError.message,
        })
      }

      if (!localeData) {
        throw createError({
          statusCode: 404,
          statusMessage: `Locale '${locale}' not found`,
        })
      }

      // Get all homepage sections with their content for the specified locale
      const { data, error } = await client
        .from('homepage_sections')
        .select(
          `
          id,
          section_name,
          image,
          homepage_section_content!inner (
            id,
            title,
            paragraph,
            button_label,
            button_link
          )
        `
        )
        .eq('homepage_section_content.locale_id', localeData.id)
        .order('section_name', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw createError({
          statusCode: Number(error.code),
          statusMessage: error.message,
        })
      }

      // Transform the data to a more convenient format
      const transformedData = data.map((section) => ({
        id: section.id,
        section_name: section.section_name,
        image: section.image,
        title: section.homepage_section_content[0]?.title,
        paragraph: section.homepage_section_content[0]?.paragraph,
        button: {
          label: section.homepage_section_content[0]?.button_label,
          link: section.homepage_section_content[0]?.button_link,
        },
      }))

      console.log('Homepage data:', transformedData)
      return transformedData
    }

    // Handle PUT request - Update homepage section content
    if (event.method === 'PUT') {
      const body = await readBody(event)
      console.log('Request body:', body)

      // Validate required fields
      if (!body.section_name || !body.locale) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Section name and locale are required',
        })
      }

      // Get the section ID
      const { data: sectionData, error: sectionError } = await client
        .from('homepage_sections')
        .select('id')
        .eq('section_name', body.section_name)
        .single()

      if (sectionError) {
        console.error('Error fetching section:', sectionError)
        throw createError({
          statusCode: Number(sectionError.code),
          statusMessage: sectionError.message,
        })
      }

      if (!sectionData) {
        throw createError({
          statusCode: 404,
          statusMessage: `Section '${body.section_name}' not found`,
        })
      }

      // Get the locale ID
      const { data: localeData, error: localeError } = await client
        .from('locales')
        .select('id')
        .eq('code', body.locale)
        .single()

      if (localeError) {
        console.error('Error fetching locale:', localeError)
        throw createError({
          statusCode: Number(localeError.code),
          statusMessage: localeError.message,
        })
      }

      if (!localeData) {
        throw createError({
          statusCode: 404,
          statusMessage: `Locale '${body.locale}' not found`,
        })
      }

      // Check if content for this section and locale already exists
      const { data: existingContent, error: existingError } = await client
        .from('homepage_section_content')
        .select('id')
        .eq('section_id', sectionData.id)
        .eq('locale_id', localeData.id)
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned"
        console.error('Error checking existing content:', existingError)
        throw createError({
          statusCode: Number(existingError.code),
          statusMessage: existingError.message,
        })
      }

      let result

      if (existingContent) {
        // Update existing content
        const { data, error } = await client
          .from('homepage_section_content')
          .update({
            title: body.title,
            paragraph: body.paragraph,
            button_label: body.button?.label,
            button_link: body.button?.link,
          })
          .eq('id', existingContent.id)
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw createError({
            statusCode: Number(error.code),
            statusMessage: error.message,
          })
        }

        result = data
      } else {
        // Insert new content
        const { data, error } = await client
          .from('homepage_section_content')
          .insert({
            section_id: sectionData.id,
            locale_id: localeData.id,
            title: body.title,
            paragraph: body.paragraph,
            button_label: body.button?.label,
            button_link: body.button?.link,
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

        result = data
      }

      // Also update the image in the homepage_sections table if provided
      if (body.image !== undefined) {
        const { error: imageError } = await client
          .from('homepage_sections')
          .update({
            image: body.image,
          })
          .eq('id', sectionData.id)

        if (imageError) {
          console.error('Error updating image:', imageError)
          throw createError({
            statusCode: Number(imageError.code),
            statusMessage: imageError.message,
          })
        }
      }

      return result
    }
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
