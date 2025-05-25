<script setup lang="ts">
  import type { Database } from '~/types/supabase'

  type Story = Database['public']['Tables']['stories']['Row'] & {
    author: {
      id: string
      name: string
      email: string
    }
    locale: {
      id: string
      code: string
      name: string
    }
  }

  useHead({
    title: 'Vom Prater Aus - Admin Dashboard',
    meta: [
      {
        name: 'description',
        content: 'Vom Prater Aus - Admin Dashboard',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
  })

  const router = useRouter()

  const stories = ref<Story[]>([])
  const isLoading = ref(true)
  const error = ref('')

  // Load stories
  async function loadStories() {
    try {
      isLoading.value = true
      const storiesData = await $fetch<Story[]>('/api/stories', {
        params: {
          admin: 'true',
        },
      })

      stories.value = storiesData
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update story status
  async function updateStoryStatus(storyId: string, newStatus: string) {
    try {
      const { error: updateError } = await useFetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        body: { status: newStatus },
      })

      if (updateError) throw updateError
      await loadStories()
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    }
  }

  // Handle sign out
  async function handleSignOut() {
    const logoutSuccessful = await $fetch('/api/admin/logout')
    if (logoutSuccessful) {
      useAuthStore().logout()
      router.push('/admin/login')
    }
  }

  // Load stories on mount
  onMounted(() => {
    loadStories()
  })
</script>

<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button
        class="sign-out-button"
        @click="handleSignOut"
      >
        Ausloggen
      </button>
    </header>

    <section class="dashboard-content">
      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>

      <div class="stories-panel">
        <div class="panel-header">
          <h2>Geschichten</h2>
        </div>

        <div
          v-if="isLoading"
          class="loading-message"
        >
          Geschichten werden geladen...
        </div>

        <div
          v-else-if="stories.length === 0"
          class="empty-message"
        >
          Keine Geschichten gefunden.
        </div>

        <div
          v-else
          class="stories-table-container"
        >
          <table class="stories-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Autor</th>
                <th>Status</th>
                <th>Erstellt</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="story in stories"
                :key="story.id"
              >
                <td>
                  <div class="story-title">
                    {{ story.title }}
                  </div>
                  <div class="story-locale">
                    {{ story.locale?.name }}
                  </div>
                </td>
                <td>
                  <div class="author-name">
                    {{ story.author?.name }}
                  </div>
                  <div class="author-email">
                    {{ story.author?.email }}
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', story.status]">
                    {{ story.status }}
                  </span>
                </td>
                <td>
                  {{
                    story.created_at
                      ? new Date(story.created_at).toLocaleDateString()
                      : ''
                  }}
                </td>
                <td>
                  <div class="story-actions">
                    <button
                      v-if="story.status === 'submitted'"
                      class="approve-button"
                      @click="updateStoryStatus(story.id, 'approved')"
                    >
                      Approve
                    </button>
                    <button
                      v-if="story.status === 'submitted'"
                      class="reject-button"
                      @click="updateStoryStatus(story.id, 'rejected')"
                    >
                      Reject
                    </button>
                    <NuxtLink
                      :to="`/stories/${story.slug}`"
                      class="view-link"
                      target="_blank"
                    >
                      View
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;
    border-bottom: 1px solid var(--color-border);

    & h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
    }
  }

  .sign-out-button {
    padding: 0.5rem 1rem;
    color: var(--color-error);
    cursor: pointer;
    background: none;
    border: none;

    &:hover,
    &:focus {
      color: var(--color-error-dark);
    }
  }

  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .error-message {
    padding: 1rem;
    margin-bottom: 1rem;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: 4px;
  }

  .stories-panel {
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }

  .panel-header {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);

    & h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-text);
    }
  }

  .loading-message,
  .empty-message {
    padding: 2rem;
    color: var(--color-text-light);
    text-align: center;
  }

  .stories-table-container {
    overflow-x: auto;
  }

  .stories-table {
    width: 100%;
    border-collapse: collapse;

    & th,
    & td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    & th {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-light);
      text-transform: uppercase;
      background-color: var(--color-background);
    }
  }

  .story-title {
    font-weight: 500;
    color: var(--color-text);
  }

  .story-locale {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .author-name {
    color: var(--color-text);
  }

  .author-email {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
    border-radius: 4px;

    &.draft {
      color: var(--color-text);
      background-color: var(--color-background);
    }

    &.approved {
      color: var(--color-success-dark);
      background-color: var(--color-success-light);
    }
  }

  .story-actions {
    display: flex;
    gap: 0.5rem;
  }

  .approve-button,
  .reject-button {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    background: none;
    border: none;
  }

  .approve-button {
    color: var(--color-success);

    &:hover,
    &:focus {
      color: var(--color-success-dark);
    }
  }

  .reject-button {
    color: var(--color-error);

    &:hover,
    &:focus {
      color: var(--color-error-dark);
    }
  }

  .view-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: var(--color-primary);
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--color-primary-dark);
    }
  }
</style>
