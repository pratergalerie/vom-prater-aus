import { createError } from 'h3'
import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { storyId, password } = body

    if (!storyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Story ID is required',
      })
    }

    const client = await serverSupabaseClient<Database>(event)

    // Get the story with its hashed password
    const { data: story, error } = await client
      .from('stories')
      .select('id, password')
      .eq('id', storyId)
      .single()

    if (error || !story) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Story not found',
      })
    }

    // If the story has no password set or if this is a new story being created
    if (!story.password || password === null) {
      const token = jwt.sign(
        { storyId: story.id },
        process.env.NUXT_STORY_JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      )
      return { token }
    }

    // For existing password-protected stories, password is required
    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password is required',
      })
    }

    // Verify the password
    const isValid = await bcrypt.compare(password, story.password)

    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid password',
      })
    }

    // Generate a JWT token for the story
    const token = jwt.sign(
      { storyId: story.id },
      process.env.NUXT_STORY_JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    )

    return {
      token,
    }
  } catch (error) {
    console.error('Password verification error:', error)
    throw error
  }
})
