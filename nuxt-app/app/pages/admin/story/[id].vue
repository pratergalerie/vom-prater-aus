<script lang="ts" setup>
  import type { Story } from '~/types/frontend'
  import { transformStoryData } from '~/utils/story'

  useHead({
    title: 'Vom Prater Aus - Story Moderation',
    meta: [
      {
        name: 'description',
        content: 'Vom Prater Aus - Story Moderation',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
    middleware: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const storyId = route.params.id as string

  const story = ref<Story | null>(null)
  const isSidebarOpen = ref(true)
  const showApproveDialog = ref(false)
  const showRejectDialog = ref(false)
  const quote = ref('')
  const isFeatured = ref(false)

  const rejectReason = ref('')

  const api = useAPI()

  // Load story data
  const {
    data: storyData,
    error,
    status,
  } = await api.getStoryById(storyId, {
    admin: true,
  })
  if (storyData.value) {
    quote.value = storyData.value.quote || ''
    isFeatured.value = storyData.value.featured || false
    story.value = transformStoryData(storyData.value)
  }

  if (error.value) {
    if (error.value.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Story not found',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.value.message,
    })
  }

  // Update story status
  async function updateStoryStatus(newStatus: string) {
    try {
      await api.updateStory(storyId, {
        status: newStatus,
        featured: isFeatured.value,
        quote: quote.value,
      })

      // Close dialogs
      showApproveDialog.value = false
      showRejectDialog.value = false

      // Return to dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      throw createError({
        statusCode: 500,
        statusMessage:
          err instanceof Error ? err.message : 'An unknown error occurred',
      })
    }
  }

  // Handle approve/reject actions
  async function handleApprove() {
    await updateStoryStatus('approved')
  }

  async function handleReject() {
    await updateStoryStatus('rejected')
  }
</script>

<template>
  <div class="admin-story-view">
    <div class="page-container">
      <div
        v-if="status === 'pending'"
        class="loading-container"
      >
        <div class="loading-spinner" />
      </div>

      <div v-else-if="error">
        <div class="error-container">
          <p>Ein Fehler ist aufgetreten. Bitte versuche es erneut.</p>
        </div>
      </div>

      <div
        v-else
        class="story-container"
      >
        <StoryViewer
          v-if="story"
          :story="story"
        />
      </div>

      <AdminModerationSidebar
        v-model:is-open="isSidebarOpen"
        v-model:is-featured="isFeatured"
        v-model:quote="quote"
        :story="story"
        @approve="
          () => {
            console.log('approve')
            showApproveDialog = true
          }
        "
        @reject="
          () => {
            console.log('reject')
            showRejectDialog = true
          }
        "
        @return="router.push('/admin/dashboard')"
      />
    </div>

    <!-- Approve Dialog -->
    <BaseDialog
      v-model:is-open="showApproveDialog"
      title="Approve Story"
      :width="400"
    >
      <p>
        Bist du dir sicher, dass du diese Geschichte genehmigen möchtest? Der
        Autor wird benachrichtigt.
      </p>
      <div class="modal-actions">
        <button @click="showApproveDialog = false">Abbrechen</button>
        <button
          class="approve-button"
          @click="handleApprove"
        >
          Genehmigen
        </button>
      </div>
    </BaseDialog>

    <!-- Reject Dialog -->
    <BaseDialog
      v-model:is-open="showRejectDialog"
      title="Geschichte ablehnen"
      :width="400"
    >
      <p>
        Bist du dir sicher, dass du diese Geschichte ablehnen möchtest? Der
        Autor wird benachrichtigt.
      </p>
      <label for="reject-reason">
        Grund für Ablehnung:
        <textarea
          id="reject-reason"
          v-model="rejectReason"
          placeholder=""
          rows="8"
        />
      </label>

      <div class="modal-actions">
        <button @click="showRejectDialog = false">Abbrechen</button>
        <button
          class="reject-button"
          @click="handleReject"
        >
          Ablehnen
        </button>
      </div>
    </BaseDialog>
  </div>
</template>

<style scoped>
  .admin-story-view {
    height: calc(100dvh - var(--header-height));
  }

  .page-container {
    position: relative;
    width: 100%;
    max-width: var(--max-width);
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .story-container {
    width: 100%;
    height: 100%;
    padding-right: 320px; /* Add space for the sidebar */
    overflow-y: auto;
  }

  #reject-reason {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    resize: none;
    border: 1px solid var(--color-black);
    border-radius: 0.25rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--color-black);
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @media screen and (prefers-reduced-motion: reduce) {
      width: 50px;
      height: 50px;
      border: 5px solid var(--color-black);
      border-bottom-color: transparent;
      border-radius: 50%;
      animation: none;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
