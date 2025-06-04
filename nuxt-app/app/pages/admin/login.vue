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
  <div class="page-container">
    <form
      class="login-form"
      @submit.prevent="handleSignIn"
    >
      <h1>Admin Login</h1>

      <div
        v-if="error"
        class="error-message"
        role="alert"
      >
        {{ error }}
      </div>

      <div class="form-group">
        <BaseTextInput
          id="email"
          v-model="email"
          type="email"
          placeholder="E-Mail"
          label="E-Mail"
          validation-key="email"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <BaseTextInput
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          label="Password"
          required
          :disabled="loading"
        />
      </div>

      <BaseButton
        type="secondary"
        variant="label-icon"
        label="Sign In"
        icon="mdi:login"
        :disabled="loading"
        @click="handleSignIn"
      />
    </form>
  </div>
</template>

<style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: var(--full-height-header-footer);
  }

  .login-form {
    max-width: 400px;
  }

  .form-group {
    margin-bottom: 20px;
  }
</style>
