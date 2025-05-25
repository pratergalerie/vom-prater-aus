export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if not accessing admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  const { user } = storeToRefs(useAuthStore())

  console.log('user', user.value)

  // If no user and trying to access admin routes
  if (!user.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  // If user exists and trying to access login page
  if (user.value && to.path === '/admin/login') {
    return navigateTo('/admin/dashboard')
  }
})
