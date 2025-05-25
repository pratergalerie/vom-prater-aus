import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { error } = await client.auth.signOut()

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to log out',
    })

    return false
  }
  return true
})
