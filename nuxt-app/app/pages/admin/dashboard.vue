<script setup lang="ts">
  import type { Story } from '~/types/frontend'
  import { transformStoryData } from '~/utils/story'

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
    middleware: 'admin',
  })

  const router = useRouter()
  const { updateStory } = useAPI()

  const stories = ref<Story[]>([])
  const error = ref('')

  const searchQuery = ref('')
  const selectedStatus = ref('all')

  const statusOptions = {
    all: 'Alle',
    submitted: 'Eingerecht',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
  }

  const filteredStories = computed(() => {
    return stories.value.filter((story: Story) => {
      const matchesSearch = story.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
      const matchesStatus =
        selectedStatus.value === 'all' || story.status === selectedStatus.value
      return matchesSearch && matchesStatus
    })
  })

  // Load stories
  const {
    data: storiesData,
    error: storiesError,
    status,
  } = await useAPI().getStories({
    admin: true,
  })
  if (storiesData.value) {
    stories.value = storiesData.value.map(convertToFrontendStory)
  } else if (storiesError.value) {
    throw createError({
      statusCode: 500,
      statusMessage: storiesError.value.message,
    })
  }

  // Update story status
  async function updateStoryStatus(storyId: string, newStatus: string) {
    try {
      await updateStory(storyId, { status: newStatus })
      const updatedStories = await useAPI().fetchStories({ admin: true })
      if (updatedStories) {
        stories.value = updatedStories.map(convertToFrontendStory)
      }
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
</script>

<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button
        class="sign-out-button highlight"
        @click="handleSignOut"
      >
        Ausloggen
        <Icon
          name="mdi:logout"
          class="logout-icon"
        />
      </button>
    </header>

    <section class="dashboard-content">
      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>

      <div
        v-if="status === 'pending'"
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
        class="stories-panel"
      >
        <div class="panel-header">
          <h2>Geschichten</h2>
          <div class="filter-controls">
            <div class="search-container">
              <Icon
                name="mdi:magnify"
                class="search-icon"
              />
              <label for="story-search">
                <input
                  id="story-search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Nach Titel suchen..."
                  class="search-input"
                />
              </label>
            </div>
            <select
              v-model="selectedStatus"
              class="status-filter"
              aria-label="Filter by status"
            >
              <option value="all">{{ statusOptions.all }}</option>
              <option value="submitted">{{ statusOptions.submitted }}</option>
              <option value="approved">{{ statusOptions.approved }}</option>
              <option value="rejected">{{ statusOptions.rejected }}</option>
            </select>
          </div>
        </div>

        <div class="stories-table-container">
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
              <tr class="divider-row">
                <td colspan="5">
                  <Divider
                    type="horizontal"
                    color="var(--color-grey)"
                    width="100%"
                    height="15px"
                    margin="0"
                    class="divider"
                  />
                </td>
              </tr>
              <template
                v-for="(story, index) in filteredStories"
                :key="story.id"
              >
                <tr>
                  <td data-label="Titel">
                    <span class="mobile-label">Titel</span>
                    <div class="story-title">
                      {{ story.title }}
                    </div>
                    <div class="story-locale">
                      {{ story.locale === 'en' ? 'English' : 'Deutsch' }}
                    </div>
                  </td>
                  <td data-label="Autor">
                    <span class="mobile-label">Autor</span>
                    <div class="author-name">
                      {{ story.author?.name }}
                    </div>
                    <div class="author-email">
                      {{ story.author?.email }}
                    </div>
                  </td>
                  <td data-label="Status">
                    <span class="mobile-label">Status</span>
                    <span :class="['status-badge', story.status]">
                      {{ story.status }}
                    </span>
                  </td>
                  <td data-label="Erstellt">
                    <span class="mobile-label">Erstellt</span>
                    {{
                      story.createdAt
                        ? story.createdAt.toLocaleDateString()
                        : ''
                    }}
                  </td>
                  <td data-label="Aktionen">
                    <span class="mobile-label">Aktionen</span>
                    <div class="story-actions">
                      <button
                        v-if="story.status === 'submitted'"
                        class="approve-button highlight"
                        @click="updateStoryStatus(story.id, 'approved')"
                      >
                        Genehmigen
                        <Icon
                          name="mdi:check"
                          class="check-icon"
                        />
                      </button>
                      <button
                        v-if="story.status === 'submitted'"
                        class="reject-button highlight"
                        @click="updateStoryStatus(story.id, 'rejected')"
                      >
                        Ablehnen
                        <Icon
                          name="mdi:close"
                          class="close-icon"
                        />
                      </button>
                      <NuxtLink
                        :to="`/admin/story/${story.id}`"
                        class="view-link highlight"
                      >
                        Moderieren
                        <Icon
                          name="mdi:arrow-right"
                          class="arrow-right"
                        />
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="index !== stories.length - 1"
                  class="divider-row"
                >
                  <td colspan="5">
                    <Divider
                      type="horizontal"
                      color="var(--color-grey)"
                      width="100%"
                      height="15px"
                      margin="0"
                    />
                  </td>
                </tr>
                <tr
                  v-if="index !== stories.length - 1"
                  class="mobile-divider"
                >
                  <td colspan="5">
                    <Divider
                      type="horizontal"
                      color="var(--color-grey)"
                      width="100%"
                      height="15px"
                      margin="0"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .admin-dashboard {
    container-type: inline-size;
    container-name: admin-dashboard;
  }

  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;

    & h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
    }
  }

  .sign-out-button {
    --highlight-color: var(--color-error-light);

    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 1rem;
    font-family: var(--font-button);
    color: var(--color-error);
    cursor: pointer;
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

  .panel-header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;

    & h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-text);
    }
  }

  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;

    & label {
      width: 100%;
    }

    & .search-icon {
      position: absolute;
      left: 0.75rem;
      font-size: 1.25rem;
      color: var(--color-text-light);
    }

    @container admin-dashboard (max-width: 700px) {
      width: 100%;
    }
  }

  .search-input {
    box-sizing: border-box;
    min-width: 200px;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    font-size: 0.875rem;
    color: var(--color-text);
    background-color: var(--color-background);
    border: 1px solid var(--color-text-light);
    border-radius: 4px;

    &::placeholder {
      color: var(--color-text-light);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    @container admin-dashboard (max-width: 700px) {
      width: 100%;
    }
  }

  .status-filter {
    padding: 0.5rem 2rem 0.5rem 1rem;
    font-size: 0.875rem;
    color: var(--color-text);
    appearance: none;
    cursor: pointer;
    background-color: var(--color-background);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    border: 1px solid var(--color-text-light);
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .loading-message,
  .empty-message {
    padding: 2rem;
    color: var(--color-text-light);
    text-align: center;
  }

  .stories-table-container {
    position: relative;
    max-height: calc(70vh - var(--header-height));
    overflow-x: auto;

    @media (max-width: 768px) {
      max-height: none;
      overflow-x: visible;
    }
  }

  .stories-table {
    width: 100%;
    border-collapse: collapse;

    & th {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-light);
      text-align: left;
      text-transform: uppercase;
      background-color: var(--color-background);
    }

    & td {
      padding: 1rem;
      text-align: left;
    }

    & .divider-row {
      & td {
        padding: 0;
      }

      @container admin-dashboard (max-width: 700px) {
        display: none;
      }
    }

    @container admin-dashboard (max-width: 700px) {
      & thead {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        white-space: nowrap;
        border: 0;
        clip: rect(0, 0, 0, 0);
      }

      & tbody {
        display: block;
      }

      & tr {
        display: block;
        margin-bottom: 1.5rem;
      }

      & td {
        display: block;
        padding: 0.75rem 1rem;
        text-align: left;

        &:last-child {
          border-bottom: none;
        }

        &[data-label] {
          & .mobile-label {
            display: block;
          }
        }
      }

      & .divider-row {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        white-space: nowrap;
        border: 0;
        clip: rect(0, 0, 0, 0);
      }
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
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;

    @container admin-dashboard (max-width: 700px) {
      flex-direction: row;
      align-items: center;
    }
  }

  .approve-button,
  .reject-button {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-family: var(--font-button);
    font-size: 0.875rem;
    text-decoration: underline;
    cursor: pointer;
    border: none;
  }

  .approve-button {
    --highlight-color: var(--color-success-light);

    color: var(--color-success);

    &:hover,
    &:focus {
      color: var(--color-success-dark);
    }
  }

  .reject-button {
    --highlight-color: var(--color-error-light);

    color: var(--color-error);

    &:hover,
    &:focus {
      color: var(--color-error-dark);
    }
  }

  .view-link {
    --highlight-color: var(--color-primary-light);

    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: var(--color-primary);

    &:hover,
    &:focus {
      color: var(--color-primary-dark);
    }
  }

  .mobile-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    clip: rect(0, 0, 0, 0);

    @container admin-dashboard (max-width: 700px) {
      position: static;
      display: block;
      width: auto;
      height: auto;
      padding: 0;
      margin: 0;
      margin-bottom: 0.25rem;
      overflow: visible;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-light);
      text-transform: uppercase;
      white-space: normal;
      clip: auto;
    }
  }

  .mobile-divider {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    clip: rect(0, 0, 0, 0);

    @container admin-dashboard (max-width: 700px) {
      position: static;
      display: table-row;
      width: auto;
      height: auto;
      height: 20px;
      padding: 0;
      margin: 0;
      overflow: visible;
      white-space: normal;
      clip: auto;

      & td {
        height: 20px;
      }
    }
  }

  @container admin-dashboard (max-width: 700px) {
    .panel-header {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-controls {
      flex-direction: column;
      width: 100%;

      & .search-container,
      & .status-filter {
        width: 100%;
      }
    }
  }
</style>
