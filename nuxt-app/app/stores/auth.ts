import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('Auth', () => {
  const user = ref<User | null>(null)

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    setUser,
    logout,
  }
})
