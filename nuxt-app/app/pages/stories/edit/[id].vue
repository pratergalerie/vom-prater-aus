<script lang="ts" setup>
  import type { PageLayout, Story } from '~/types/frontend'

  definePageMeta({
    middleware: ['story-auth'],
  })

  const deletePageConfirmationModalOpen = ref(false)
  const showDeleteModal = ref(false)
  const showSubmitModal = ref(false)
  const exitEditorConfirmationModalOpen = ref(false)
  const showDetailsModal = ref(false)

  const snackbarOpen = ref(false)
  const snackbarMessage = ref('')
  const saving = ref(false)
  const { addPage, deletePage, setStory, loadStory, setCurrentPageIndex } =
    useStoryStore()
  const { story, currentPageIndex } = storeToRefs(useStoryStore())

  // Ensure currentPageIndex is properly initialized
  watchEffect(() => {
    if (
      story.value?.pages &&
      currentPageIndex.value >= story.value.pages.length &&
      story.value.pages.length > 0
    ) {
      const newIndex = Math.max(0, story.value.pages.length - 1)
      if (newIndex !== currentPageIndex.value) {
        setCurrentPageIndex(newIndex)
      }
    }
  })

  // First check if story exists in IndexedDB
  const storyId = useRoute().params.id as string
  await loadStory(storyId)

  if (!story.value) {
    // Get the story token from session storage
    const storyToken = sessionStorage.getItem(`story_token_${storyId}`)

    // If story doesn't exist, fetch from backend
    const { data: storyData } = await useAPI().getStoryById(storyId, {
      token: storyToken,
    })
    if (storyData.value) {
      // Convert storyData to Story format
      const convertedStory: Story = {
        id: storyData.value.id,
        title: storyData.value.title,
        slug: storyData.value.slug,
        author: {
          id: storyData.value.author.id,
          name: storyData.value.author.name,
          email: storyData.value.author.email,
        },
        modifiedAt: storyData.value.modified_at
          ? new Date(storyData.value.modified_at)
          : null,
        year: storyData.value.year,
        keywords: [],
        pages:
          storyData.value.pages?.map((page) => ({
            id: page.id,
            layout: page.layout as PageLayout,
            text: page.text,
            image: page.image,
            createdAt: new Date(page.created_at || new Date()),
            modifiedAt: new Date(page.modified_at || new Date()),
            pageOrder: page.page_order,
          })) || [],
        createdAt: new Date(storyData.value.created_at || new Date()),
        locale: storyData.value.locale.code as 'en' | 'de',
        status: storyData.value.status as
          | 'draft'
          | 'submitted'
          | 'approved'
          | 'rejected',
        featured: storyData.value.featured || false,
        featuredImage: storyData.value.featured_image,
        quote: storyData.value.quote,
      }
      setStory(convertedStory)
    }
  }

  function handleDeleteStory() {
    // TODO: Implement delete story
    const router = useRouter()
    router.push('/stories/explorer')
  }

  async function handleAddPage() {
    if (!story.value) return

    const date = new Date()
    try {
      // Create the page on the server first
      const newPage = await useAPI().createPage({
        story_id: story.value.id,
        layout: 'image-over-text',
        text: null,
        image: null,
        page_order: story.value.pages.length + 1,
        created_at: date.toISOString(),
        modified_at: null,
      })

      // Update local state with the server-created page
      addPage({
        id: newPage.id,
        layout: newPage.layout as PageLayout,
        text: newPage.text,
        image: newPage.image,
        createdAt: newPage.created_at ? new Date(newPage.created_at) : date,
        modifiedAt: newPage.modified_at
          ? new Date(newPage.modified_at)
          : undefined,
        pageOrder: newPage.page_order,
      })
      setCurrentPageIndex(currentPageIndex.value + 1)
    } catch (error) {
      console.error('Error creating new page:', error)
      // Show error notification
      snackbarOpen.value = true
      snackbarMessage.value = t('pages.stories.edit.snackbar.saveError')
    }
  }

  async function handleDeletePage() {
    if (!story.value) return

    const currentPage = story.value.pages[currentPageIndex.value]
    if (!currentPage?.id) {
      // If the page doesn't have an ID, just delete it from local state
      deletePage(currentPageIndex.value)
      setCurrentPageIndex(currentPageIndex.value - 1)
      deletePageConfirmationModalOpen.value = false
      return
    }

    try {
      // Delete the page from the server first
      await useAPI().deleteStoryPage(story.value.id, currentPage.id)

      // If successful, update local state
      deletePage(currentPageIndex.value)
      setCurrentPageIndex(currentPageIndex.value - 1)
      deletePageConfirmationModalOpen.value = false
    } catch (error) {
      console.error('Error deleting page:', error)
      // Show error notification
      snackbarOpen.value = true
      snackbarMessage.value = t('pages.stories.edit.snackbar.saveError')
    }
  }

  const { t } = useI18n()

  async function handleSaveChanges() {
    if (!story.value) return

    saving.value = true
    try {
      // Update story details
      const storyData = {
        title: story.value.title,
        author_id: story.value.author.id || undefined,
        year: story.value.year,
      }

      // Update story in Supabase
      await useAPI().updateStory(story.value.id, storyData)

      // Update each page
      for (const [index, page] of story.value.pages.entries()) {
        if (page.id) {
          // Update existing page
          await useAPI().updateStoryPage(story.value.id, page.id, {
            layout: page.layout,
            text: page.text,
            image: page.image,
            page_order: index + 1,
            modified_at: new Date().toISOString(),
          })
        } else {
          // Create new page
          await useAPI().createPage({
            story_id: story.value.id,
            layout: page.layout,
            text: page.text,
            image: page.image,
            page_order: index + 1,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
          })
        }
      }

      // Show success notification
      snackbarOpen.value = true
      snackbarMessage.value = t('pages.stories.edit.snackbar.saveSuccess')
    } catch (error) {
      console.error('Error saving story:', error)
      // Show error notification
      snackbarOpen.value = true
      snackbarMessage.value = t('pages.stories.edit.snackbar.saveError')
    } finally {
      saving.value = false
    }
  }

  async function handleSubmit() {
    showSubmitModal.value = false

    try {
      // First save any pending changes
      await handleSaveChanges()

      if (!story.value) return

      // Update story status to submitted
      await useAPI().updateStory(story.value.id, {
        status: 'submitted',
        modified_at: new Date().toISOString(),
      })

      // Navigate to submitted page
      const router = useRouter()
      router.push('/stories/submitted')
    } catch (error) {
      console.error('Error submitting story:', error)
      // Show error notification
      snackbarOpen.value = true
      snackbarMessage.value = t('pages.stories.edit.snackbar.saveError')
    }
  }

  function handleExitEditor() {
    exitEditorConfirmationModalOpen.value = false
    const router = useRouter()

    router.push('/stories/explorer')
  }

  function handleSaveStoryDetails() {
    showDetailsModal.value = false
    // TODO: Implement save new story details
  }

  function handleCancelEditStoryDetails() {
    showDetailsModal.value = false
    // TODO: Implement cancel edit story details
  }
</script>

<template>
  <div class="page-container">
    <StoryPageEditor
      :story="story"
      :current-page-index="currentPageIndex"
      :saving="saving"
      class="story-editor"
      @delete-page="deletePageConfirmationModalOpen = true"
      @delete-story="showDeleteModal = true"
      @add-page="handleAddPage"
      @save-changes="handleSaveChanges"
      @submit="showSubmitModal = true"
      @exit-editor="exitEditorConfirmationModalOpen = true"
      @edit-story-details="showDetailsModal = true"
    />
    <div class="page-navigation">
      <button
        v-if="currentPageIndex > 0"
        class="page-navigation-button"
        @click="setCurrentPageIndex(currentPageIndex - 1)"
      >
        <Icon name="mdi:arrow-left" />
      </button>
      <span class="page-navigation-text">
        {{ `${$t('components.storyPageEditor.page')} ${currentPageIndex + 1}` }}
      </span>
      <button
        v-if="
          story?.pages &&
          story?.pages.length > 0 &&
          currentPageIndex < story.pages.length - 1
        "
        class="page-navigation-button"
        @click="setCurrentPageIndex(currentPageIndex + 1)"
      >
        <Icon name="mdi:arrow-right" />
      </button>
    </div>

    <!-- ------------------------------------------------------------------- -->
    <!-- --------------------------- Modals -------------------------------- -->
    <!-- ------------------------------------------------------------------- -->

    <!-- --------------- Exit Editor Confirmation Modal -------------------- -->
    <BaseDialog
      v-model:is-open="exitEditorConfirmationModalOpen"
      modal
      :width="320"
      :title="$t('pages.stories.edit.modals.exitEditor.title')"
    >
      <div class="modal-content exit">
        <p>
          {{ $t('pages.stories.edit.modals.exitEditor.description') }}
        </p>
        <div class="modal-actions">
          <button @click="exitEditorConfirmationModalOpen = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.exitEditor.cancel') }}
          </button>

          <button @click="handleExitEditor">
            <Icon name="mdi:exit-to-app" />
            {{ $t('pages.stories.edit.modals.exitEditor.confirm') }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- --------------- Delete Page Confirmation Modal -------------------- -->
    <BaseDialog
      v-model:is-open="deletePageConfirmationModalOpen"
      modal
      width="300"
      :title="$t('pages.stories.edit.modals.deletePage.title')"
    >
      <div class="modal-content delete">
        <p>
          {{ $t('pages.stories.edit.modals.deletePage.description') }}
        </p>
        <div class="modal-actions">
          <button @click="deletePageConfirmationModalOpen = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.deletePage.cancel') }}
          </button>
          <button @click="handleDeletePage">
            <Icon name="mdi:delete-outline" />
            {{ $t('pages.stories.edit.modals.deletePage.confirm') }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- -------------- Delete Story Confirmation Modal -------------------- -->
    <BaseDialog
      v-model:is-open="showDeleteModal"
      modal
      width="300px"
      :title="$t('pages.stories.edit.modals.deleteStory.title')"
    >
      <div class="modal-content delete">
        <p>
          {{ $t('pages.stories.edit.modals.deleteStory.description') }}
        </p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.deletePage.cancel') }}
          </button>
          <button @click="handleDeleteStory">
            <Icon name="mdi:delete-outline" />
            {{ $t('pages.stories.edit.modals.deleteStory.confirm') }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- ---------------- Submit Story Confirmation Modal ------------------ -->
    <BaseDialog
      v-model:is-open="showSubmitModal"
      modal
      width="350px"
      :title="$t('pages.stories.edit.modals.submitStory.title')"
    >
      <div class="modal-content submit">
        <p>
          {{ $t('pages.stories.edit.modals.submitStory.description') }}
        </p>
        <div class="modal-actions">
          <button @click="showSubmitModal = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.submitStory.cancel') }}
          </button>
          <button @click="handleSubmit">
            <Icon name="mdi:check-outline" />
            {{ $t('pages.stories.edit.modals.submitStory.confirm') }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- --------------------- Story Details Modal ------------------------- -->
    <BaseDialog
      v-model:is-open="showDetailsModal"
      modal
      width="350px"
      :title="$t('pages.stories.edit.modals.details.title')"
    >
      <div class="modal-content story-properties">
        <form
          class="story-detail-form"
          @submit.prevent
        >
          <div
            v-if="story"
            class="story-details-form-row"
          >
            <label for="story-title">
              {{ $t('pages.stories.edit.modals.details.storyTitle') }}
              <input
                id="story-title"
                v-model="story.title"
                type="text"
                aria-label="Story title"
              />
            </label>

            <label for="story-author">
              {{ $t('pages.stories.edit.modals.details.authorName') }}
              <input
                id="story-author"
                v-model="story.author.name"
                type="text"
              />
            </label>

            <label for="story-year">
              {{ $t('pages.stories.edit.modals.details.storyYear') }}
              <input
                id="story-year"
                v-model="story.year"
                type="number"
                aria-label="Story year"
              />
            </label>
          </div>
          <div class="modal-actions">
            <button @click="handleCancelEditStoryDetails">
              {{ $t('pages.stories.edit.modals.details.cancel') }}
            </button>
            <button
              type="submit"
              @click="handleSaveStoryDetails"
            >
              {{ $t('pages.stories.edit.modals.details.confirm') }}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>

    <BaseSnackbar
      v-model="snackbarOpen"
      :message="snackbarMessage"
      :timeout="5000"
    />
  </div>
</template>

<style scoped>
  .page-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
    justify-content: flex-start;
    height: calc(100dvh - var(--header-height));
  }

  .story-editor {
    width: 100%;
    height: calc(100% - 120px);
  }

  .page-navigation {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    height: 30px;

    .page-navigation-button {
      width: 30px;
      height: 30px;
      cursor: pointer;
      background: none;
      border: none;

      span {
        font-size: 1.5rem;
      }

      &:first-child {
        grid-column: 1;
        margin-left: auto;
      }

      &:last-child {
        grid-column: 3;
      }
    }

    .page-navigation-text {
      grid-column: 2;
      margin: auto;
      font-family: var(--font-link);
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    height: 100%;

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
      width: 100px;
      padding: 0.5rem;
      font-family: var(--font-link);
      font-size: 0.8rem;
      color: var(--color-black);
      cursor: pointer;
      background: radial-gradient(
        circle,
        white 0%,
        white 40%,
        rgb(255 255 255 / 70%) 70%,
        transparent 100%
      );
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      border: none;
    }

    p {
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .story-detail-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;

      .story-details-form-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        input {
          box-sizing: border-box;
          width: 100%;
          max-width: 200px;
          padding: 0.5rem;
          border: 1px solid var(--color-black);
        }

        #story-year {
          width: 100px;
        }
      }

      .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
    }
  }
</style>
