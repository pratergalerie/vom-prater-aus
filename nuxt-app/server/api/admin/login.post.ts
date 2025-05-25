import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const client = await serverSupabaseClient(event)

  try {
    // Sign in with password
    const { data: authData, error: signInError } =
      await client.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) throw signInError
    if (!authData.user || !authData.session) {
      throw new Error('Invalid credentials')
    }

    // Validate the user's JWT token
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser(authData.session.access_token)

    if (userError || !user) {
      throw new Error('Failed to validate user token')
    }

    return {
      user,
      session: authData.session,
    }
  } catch (error) {
    console.error('Login error:', error)
    throw createError({
      statusCode: 401,
      message: error instanceof Error ? error.message : 'Authentication failed',
    })
  }
})
