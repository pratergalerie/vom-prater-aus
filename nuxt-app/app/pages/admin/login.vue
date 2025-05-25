<script setup lang="ts">
  const email = ref('')
  const password = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  const { user } = storeToRefs(useAuthStore())
  const { setUser } = useAuthStore()

  // If user is already logged in, redirect to dashboard
  watchEffect(() => {
    if (user.value) {
      navigateTo('/admin/dashboard')
    }
  })

  async function handleSignIn() {
    try {
      loading.value = true
      error.value = null

      // Call our server-side login endpoint using $fetch
      await $fetch('/api/admin/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
        },
      })

      const userData = await $fetch('/api/admin/user')

      setUser(userData)

      // Navigate to dashboard on success
      navigateTo('/admin/dashboard')
    } catch (e) {
      console.error('Login error:', e)
      error.value =
        e instanceof Error ? e.message : 'An error occurred during sign in'
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleSignIn">
      <h1>Admin Login</h1>

      <div
        v-if="error"
        class="error-message"
        role="alert"
      >
        {{ error }}
      </div>

      <div class="form-group">
        <label for="email">
          E-Mail
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="E-Mail"
            required
            :disabled="loading"
            autocomplete="email"
        /></label>
      </div>

      <div class="form-group">
        <label for="password">
          Password
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            required
            :disabled="loading"
            autocomplete="current-password"
        /></label>
      </div>

      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
  .login-container {
    max-width: 400px;
    padding: 20px;
    margin: 40px auto;
  }

  .form-group {
    margin-bottom: 20px;

    & label {
      display: block;
      margin-bottom: 5px;
    }

    & input {
      width: 100%;
      padding: 8px;
      border: 1px solid rgb(204 204 204);
      border-radius: 4px;
    }
  }

  .error-message {
    padding: 10px;
    margin-bottom: 20px;
    color: rgb(220 53 69);
    background-color: rgb(248 215 218);
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 10px;
    color: white;
    cursor: pointer;
    background-color: rgb(0 123 255);
    border: none;
    border-radius: 4px;

    &:disabled {
      cursor: not-allowed;
      background-color: rgb(204 204 204);
    }
  }
</style>
