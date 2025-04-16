<script lang="ts" setup>
  const { story } = storeToRefs(useStoryStore())

  definePageMeta({
    layout: 'no-footer',
  })

  const currentPageIndex = ref(0)

  const deletePageConfirmationModalOpen = ref(false)
  const deleteStoryConfirmationModalOpen = ref(false)
  const submitConfirmationModalOpen = ref(false)
  const exitEditorConfirmationModalOpen = ref(false)
  const storyDetailsModalOpen = ref(false)

  const { addPage, deletePage } = useStoryStore()

  function handleDeleteStory() {
    // TODO: Implement delete story
    const router = useRouter()
    router.push('/stories/explorer')
  }

  function handleAddPage() {
    addPage()
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

  const newStoryDetails = ref({
    title: story.value.title,
    author: story.value.author.name,
    year: story.value.year,
  })

  function handleSaveStoryDetails() {
    story.value.title = newStoryDetails.value.title
    story.value.author.name = newStoryDetails.value.author
    story.value.year = newStoryDetails.value.year
    storyDetailsModalOpen.value = false
  }

  function handleCancelEditStoryDetails() {
    storyDetailsModalOpen.value = false
    newStoryDetails.value = {
      title: story.value.title,
      author: story.value.author.name,
      year: story.value.year,
    }
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
        v-if="currentPageIndex < story.pages.length - 1"
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
          <div class="story-details-form-row">
            <label for="story-title">
              {{ $t('pages.stories.edit.modals.details.storyTitle') }}
              <input
                id="story-title"
                v-model="newStoryDetails.title"
                type="text"
                aria-label="Story title"
              />
            </label>

            <label for="story-author">
              {{ $t('pages.stories.edit.modals.details.authorName') }}
              <input
                id="story-author"
                v-model="newStoryDetails.author"
                type="text"
              />
            </label>

            <label for="story-year">
              {{ $t('pages.stories.edit.modals.details.storyYear') }}
              <input
                id="story-year"
                v-model="newStoryDetails.year"
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
