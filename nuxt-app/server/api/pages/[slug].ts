import { createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'
import type { H3Event } from 'h3'
import type { Page } from '~/types'

function getLocale(event: H3Event): string {
  const query = getQuery(event)
  return (query.locale as string) || 'en'
}

export default defineEventHandler(async (event: H3Event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    })
  }

  const supabase = await serverSupabaseClient<Database>(event)
  const localeCode = getLocale(event)

  try {
    // First, get the locale ID based on the locale code
    const { data: localeData, error: localeError } = await supabase
      .from('locales')
      .select('id')
      .eq('code', localeCode)
      .single()

    if (localeError) {
      console.error('Error fetching locale:', localeError)
      throw createError({
        statusCode: 500,
        message: 'Error fetching locale',
      })
    }

    if (!localeData) {
      console.error(`Locale not found: ${localeCode}`)
      throw createError({
        statusCode: 404,
        message: `Locale not found: ${localeCode}`,
      })
    }

    const localeId = localeData.id

    // Get the page with its sections and content
    const { data, error: pageError } = await supabase
      .from('pages')
      .select(
        `
        id,
        slug,
        sections (
          id,
          name,
          type,
          "order",
          section_content (
            id,
            title,
            subtitle,
            text,
            image_src,
            image_alt,
            button_label,
            button_link,
            additional_content,
            locale_id
          )
        )
      `
      )
      .eq('slug', slug)
      .single()

    if (pageError) {
      console.error('Error fetching page:', pageError)
      throw createError({
        statusCode: 500,
        message: 'Error fetching page',
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        message: 'Page not found',
      })
    }

    // Map the data to the expected format
    const mappedPage = {
      id: data.id,
      slug: data.slug,
      sections: data.sections.map((section) => {
        // Find the content for the current locale
        const content = section.section_content?.find(
          (content) => content.locale_id === localeId
        )

        return {
          id: section.id,
          name: section.name,
          type: section.type,
          order: section.order,
          content: content
            ? {
                id: content.id,
                title: content.title,
                subtitle: content.subtitle,
                text: content.text,
                imageSrc: content.image_src,
                imageAlt: content.image_alt,
                buttonLabel: content.button_label,
                buttonLink: content.button_link,
                additionalContent: content.additional_content,
              }
            : null,
        }
      }),
    } as Page

    return mappedPage
  } catch (error) {
    console.error(`Error fetching page data for: /${slug}`, error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
