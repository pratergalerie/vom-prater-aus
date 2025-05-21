export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply to story edit routes
  if (!to.path.startsWith('/stories/edit/')) {
    return
  }

  const storyId = to.params.id as string
  if (!storyId) {
    return navigateTo('/stories/explorer')
  }

  // Get the stored token
  const token = import.meta.client
    ? sessionStorage.getItem(`story_token_${storyId}`)
    : null

  if (!token) {
    // Redirect to the unlock page
    return navigateTo(`/stories/unlock/${storyId}`)
  }
})
