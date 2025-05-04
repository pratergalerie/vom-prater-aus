<script lang="ts" setup>
  import type { PageLayout, Story } from '~/types/frontend'

  definePageMeta({
    layout: 'no-footer',
  })

  const deletePageConfirmationModalOpen = ref(false)
  const deleteStoryConfirmationModalOpen = ref(false)
  const submitConfirmationModalOpen = ref(false)
  const exitEditorConfirmationModalOpen = ref(false)
  const storyDetailsModalOpen = ref(false)

  const { addPage, deletePage, setStory, loadStory } = useStoryStore()
  const { story, currentPageIndex } = storeToRefs(useStoryStore())

  // Ensure currentPageIndex is properly initialized
  watchEffect(() => {
    if (
      story.value?.pages &&
      currentPageIndex.value >= story.value.pages.length
    ) {
      currentPageIndex.value = Math.max(0, story.value.pages.length - 1)
    }
  })

  // First check if story exists in IndexedDB
  const storyId = useRoute().params.id as string
  await loadStory(storyId)

  if (!story.value) {
    // If story doesn't exist, fetch from backend
    const { data: storyData } = await useAPI().getStoryById(storyId)
    if (storyData.value) {
      // Convert storyData to Story format
      const convertedStory: Story = {
        id: storyData.value.id,
        title: storyData.value.title,
        author: {
          id: storyData.value.author.id,
          name: storyData.value.author.name,
          email: storyData.value.author.email,
        },
        year: storyData.value.year,
        keywords: [],
        pages:
          storyData.value.pages?.map((page) => ({
            id: page.id,
            layout: page.layout as PageLayout,
            text: page.text,
            image: page.image,
            createdAt: new Date(page.created_at || new Date()),
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

  function handleAddPage() {
    const date = new Date()
    const newPage = {
      id: null,
      layout: 'image-over-text' as PageLayout,
      text: null,
      image: null,
      createdAt: date,
      modifiedAt: date,
    }
    addPage(newPage)
    currentPageIndex.value++
  }

  function handleDeletePage() {
    deletePage(currentPageIndex.value)
    currentPageIndex.value--
    deletePageConfirmationModalOpen.value = false
  }

  function handleSaveChanges() {
    // TODO: implement save logic
  }

  function handleSubmit() {
    // TODO: Implement submit story
    const router = useRouter()
    router.push('/stories/submitted')
  }

  function handleExitEditor() {
    exitEditorConfirmationModalOpen.value = false
    const router = useRouter()

    router.push('/stories/explorer')
  }

  function handleSaveStoryDetails() {
    storyDetailsModalOpen.value = false
    // TODO: Implement save new story details
  }

  function handleCancelEditStoryDetails() {
    storyDetailsModalOpen.value = false
    // TODO: Implement cancel edit story details
  }
</script>

<template>
  <div class="page-container">
    <StoryPageEditor
      :page-index="currentPageIndex"
      class="story-editor"
      @delete-page="deletePageConfirmationModalOpen = true"
      @delete-story="deleteStoryConfirmationModalOpen = true"
      @add-page="handleAddPage"
      @save-changes="handleSaveChanges"
      @submit="submitConfirmationModalOpen = true"
      @exit-editor="exitEditorConfirmationModalOpen = true"
      @edit-story-details="storyDetailsModalOpen = true"
    />
    <div class="page-navigation">
      <BaseButton
        v-if="currentPageIndex > 0"
        type="primary"
        variant="icon"
        icon="mdi:arrow-left"
        class="page-navigation-button"
        @click="currentPageIndex--"
      />
      <span class="page-navigation-text">
        {{ `${$t('components.storyPageEditor.page')} ${currentPageIndex + 1}` }}
      </span>
      <BaseButton
        v-if="
          story?.pages &&
          story?.pages.length > 0 &&
          currentPageIndex < story.pages.length - 1
        "
        type="primary"
        variant="icon"
        icon="mdi:arrow-right"
        class="page-navigation-button"
        @click="currentPageIndex++"
      />
    </div>

    <!-- Confirmation Modals -->

    <BaseModal v-model="exitEditorConfirmationModalOpen">
      <div class="modal-content exit">
        <h2>
          {{ $t('pages.stories.edit.modals.exitEditor.title') }}
        </h2>
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
    </BaseModal>

    <BaseModal v-model="deletePageConfirmationModalOpen">
      <div class="modal-content delete">
        <h2>
          {{ $t('pages.stories.edit.modals.deletePage.title') }}
        </h2>
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
    </BaseModal>

    <BaseModal v-model="deleteStoryConfirmationModalOpen">
      <div class="modal-content delete">
        <h2>
          {{ $t('pages.stories.edit.modals.deleteStory.title') }}
        </h2>
        <p>
          {{ $t('pages.stories.edit.modals.deleteStory.description') }}
        </p>
        <div class="modal-actions">
          <button @click="deleteStoryConfirmationModalOpen = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.deletePage.cancel') }}
          </button>
          <button @click="handleDeleteStory">
            <Icon name="mdi:delete-outline" />
            {{ $t('pages.stories.edit.modals.deleteStory.confirm') }}
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="submitConfirmationModalOpen">
      <div class="modal-content submit">
        <h2>
          {{ $t('pages.stories.edit.modals.submitStory.title') }}
        </h2>
        <p>
          {{ $t('pages.stories.edit.modals.submitStory.description') }}
        </p>
        <div class="modal-actions">
          <button @click="submitConfirmationModalOpen = false">
            <Icon name="mdi:close" />
            {{ $t('pages.stories.edit.modals.submitStory.cancel') }}
          </button>
          <button @click="handleSubmit">
            <Icon name="mdi:check-outline" />
            {{ $t('pages.stories.edit.modals.submitStory.confirm') }}
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="storyDetailsModalOpen">
      <div class="modal-content story-properties">
        <h2>
          {{ $t('pages.stories.edit.modals.details.title') }}
        </h2>
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
    </BaseModal>
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
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .modal-actions {
      display: flex;
      gap: 1rem;
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
      line-height: 1.5;
    }

    h2,
    p {
      font-size: 0.8rem;
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
