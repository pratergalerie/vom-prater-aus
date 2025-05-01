import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const code = getRouterParam(event, 'code')

    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Locale code is required',
      })
    }

    const { data, error } = await client
      .from('locales')
      .select('*')
      .eq('code', code)
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
        statusMessage: `Locale with code ${code} not found`,
      })
    }

    return data
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
