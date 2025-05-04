<script setup lang="ts">
  import type { PageLayout, Story } from '~/types/frontend'

  const props = defineProps<{
    story: Story | null
    currentPageIndex: number
    saving?: boolean
  }>()

  // Remove direct store access
  const { updatePage } = useStoryStore()

  const currentPage = computed(() => {
    if (!props.story) return null
    return props.story.pages[props.currentPageIndex]
  })

  // Only watch for actual content changes
  watch(
    () => currentPage.value?.text,
    (newText) => {
      if (currentPage.value && newText !== undefined) {
        updatePage(props.currentPageIndex, { text: newText })
      }
    }
  )

  watch(
    () => currentPage.value?.image,
    (newImage) => {
      if (currentPage.value && newImage !== undefined) {
        updatePage(props.currentPageIndex, { image: newImage })
      }
    }
  )

  watch(
    () => currentPage.value?.layout,
    (newLayout) => {
      if (currentPage.value && newLayout !== undefined) {
        updatePage(props.currentPageIndex, { layout: newLayout })
      }
    }
  )

  const layout = computed(() => {
    return currentPage.value?.layout || 'image-over-text'
  })

  const imageOverText = ref(false)
  const textOverImage = ref(false)

  // Initialize checkboxes based on initial layout
  onMounted(() => {
    if (layout.value === 'image-over-text') {
      imageOverText.value = true
      textOverImage.value = false
    } else if (layout.value === 'text-over-image') {
      imageOverText.value = false
      textOverImage.value = true
    }
  })

  watch(
    layout,
    (newLayout) => {
      if (newLayout === 'image-over-text') {
        imageOverText.value = true
        textOverImage.value = false
      } else if (newLayout === 'text-over-image') {
        imageOverText.value = false
        textOverImage.value = true
      }
    },
    { immediate: true }
  )

  watch(imageOverText, (newValue) => {
    if (newValue && currentPage.value) {
      updatePage(props.currentPageIndex, {
        ...currentPage.value,
        layout: 'image-over-text',
      })
      textOverImage.value = false
    }
  })

  watch(textOverImage, (newValue) => {
    if (newValue && currentPage.value) {
      updatePage(props.currentPageIndex, {
        ...currentPage.value,
        layout: 'text-over-image',
      })
      imageOverText.value = false
    }
  })

  const placeholderImage = '/imgs/page-placeholder-image.jpg'

  const pageImage = computed(() => {
    return currentPage.value?.image || placeholderImage
  })

  const deleteActionDialogOpen = ref(false)
  const addActionDialogOpen = ref(false)
  const saveSubmitActionDialogOpen = ref(false)
  const pageLayoutActionDialogOpen = ref(false)

  const editorMenu = [
    {
      id: 'close',
      icon: 'mdi:close',
      action: () => emit('exitEditor'),
    },
    {
      id: 'delete',
      icon: 'mdi:delete',
      action: () => {
        deleteActionDialogOpen.value = true
      },
    },
    {
      id: 'add',
      icon: 'mdi:add',
      action: () => {
        addActionDialogOpen.value = true
      },
    },
    {
      id: 'save-submit',
      icon: 'custom:save-submit',
      action: () => {
        saveSubmitActionDialogOpen.value = true
      },
    },
    {
      id: 'settings',
      icon: 'mdi:settings',
      action: () => {
        pageLayoutActionDialogOpen.value = true
      },
    },
  ]

  const emit = defineEmits([
    'addPage',
    'deletePage',
    'deleteStory',
    'saveChanges',
    'submit',
    'exitEditor',
    'editStoryDetails',
  ])

  function handleAddPage() {
    emit('addPage')
  }

  function handleDeletePage() {
    emit('deletePage')
  }

  function handleDeleteStory() {
    emit('deleteStory')
  }

  function handleSaveChanges() {
    emit('saveChanges')
  }

  function handleSubmit() {
    emit('submit')
  }

  function handleAddImage() {
    // Open file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file && currentPage.value) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (currentPage.value) {
            updatePage(props.currentPageIndex, {
              ...currentPage.value,
              image: event.target?.result as string,
            })
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  function handleChangeLayout(layout: PageLayout) {
    if (currentPage.value) {
      updatePage(props.currentPageIndex, { ...currentPage.value, layout })
    }
  }

  function handleAddSticker() {
    // TODO: implement sticker logic
  }

  function handleCheckboxChange(type: 'image-over-text' | 'text-over-image') {
    if (type === 'image-over-text' && currentPage.value) {
      updatePage(props.currentPageIndex, {
        ...currentPage.value,
        layout: 'image-over-text',
      })
      textOverImage.value = false
    } else if (currentPage.value) {
      updatePage(props.currentPageIndex, {
        ...currentPage.value,
        layout: 'text-over-image',
      })
      imageOverText.value = false
    }
  }
</script>

<template>
  <div
    class="page-editor-container"
    :style="{}"
  >
    <div
      class="page-content"
      :class="{ 'text-over-image': layout === 'text-over-image' }"
    >
      <div
        class="image-title-container"
        :class="{
          'full-height': layout === 'image',
          'min-height': layout === 'text',
        }"
      >
        <div
          v-if="layout !== 'text'"
          class="image-container"
        >
          <NuxtImg
            v-if="pageImage"
            :src="pageImage"
            alt="Story page image"
          />
        </div>
        <CutoutShape
          v-if="currentPageIndex === 0"
          shape-class="shape-textbox-1"
          color="pink"
          purpose="textbox"
          :shadow="true"
          class="title-box"
          :class="{
            'top-aligned': layout === 'text-over-image',
            'bottom-aligned': layout === 'image-over-text',
          }"
        >
          <div
            v-if="currentPageIndex === 0"
            class="title-box-content"
          >
            <h1>{{ story?.title }}</h1>
            <div class="author-info">
              <span>{{ $t('components.storyPageEditor.byAuthor') }}</span>
              <span class="name">{{ story?.author.name }}</span>
            </div>
            <div class="date">
              <Icon name="mdi:calendar-month" />
              {{ story?.year }}
            </div>
            <button
              class="story-details-edit-button"
              @click="emit('editStoryDetails')"
            >
              <Icon name="mdi:edit" />
            </button>
          </div>
        </CutoutShape>
      </div>

      <label
        v-if="layout !== 'image' && currentPage"
        for="page-text-input"
        class="text-container"
        :class="{
          'full-height': layout === 'text',
        }"
      >
        <textarea
          id="page-text-input"
          v-model="currentPage.text"
          :placeholder="$t('components.storyPageEditor.pageTextPlaceholder')"
        />
      </label>
    </div>

    <StoryPageDivider
      v-if="layout === 'image-over-text' || layout === 'text-over-image'"
      :shape-variant-index="0"
      color="mint"
      class="divider"
    />

    <div class="story-actions">
      <div
        v-for="(action, index) in editorMenu"
        :key="index"
        class="action-wrapper"
      >
        <BaseDialog
          v-if="action.id === 'delete'"
          v-model="deleteActionDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog delete"
        >
          <div class="dialog-content">
            <button
              :disabled="currentPageIndex === 0"
              @click="handleDeletePage"
            >
              <Icon name="mdi:close-box-outline" />
              {{
                $t(
                  'components.storyPageEditor.dialogs.actions.delete.deletePage'
                )
              }}
            </button>
            <button @click="handleDeleteStory">
              <Icon name="mdi:delete-outline" />
              {{
                $t(
                  'components.storyPageEditor.dialogs.actions.delete.deleteStory'
                )
              }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'add'"
          v-model="addActionDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog add"
        >
          <div class="dialog-content">
            <button @click="handleAddImage">
              <Icon name="mdi:image-plus-outline" />
              {{
                $t('components.storyPageEditor.dialogs.actions.add.addImage')
              }}

              <label
                for="image-upload"
                class="visually-hidden"
              >
                <input
                  id="image-upload"
                  type="file"
                  aria-label="Upload image"
                  accept="image/*"
                  class="visually-hidden"
                  @change="handleAddImage"
                />
              </label>
            </button>
            <button
              aria-label="Add new page"
              @click="handleAddPage"
            >
              <Icon name="mdi:note-plus-outline" />
              {{ $t('components.storyPageEditor.dialogs.actions.add.addPage') }}
            </button>
            <button @click="handleAddSticker">
              <Icon name="mdi:shape-polygon-plus" />
              {{
                $t('components.storyPageEditor.dialogs.actions.add.addSticker')
              }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'save-submit'"
          v-model="saveSubmitActionDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog save-submit"
        >
          <div class="dialog-content">
            <div class="save-changes-loading-container">
              <div
                v-if="saving"
                class="save-changes-loading"
              >
                <span class="spinner"></span>
                <span>{{
                  $t(
                    'components.storyPageEditor.dialogs.actions.saveSubmit.saving'
                  )
                }}</span>
              </div>
              <button
                v-else
                @click="handleSaveChanges"
              >
                <Icon name="mdi:content-save-outline" />
                {{
                  $t(
                    'components.storyPageEditor.dialogs.actions.saveSubmit.saveChanges'
                  )
                }}
              </button>
            </div>
            <button @click="handleSubmit">
              <Icon name="mdi:send-variant-outline" />
              {{
                $t(
                  'components.storyPageEditor.dialogs.actions.saveSubmit.submitStory'
                )
              }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'settings'"
          v-model="pageLayoutActionDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-right"
          class="dialog settings"
        >
          <div class="dialog-content">
            <h2>
              {{
                $t(
                  'components.storyPageEditor.dialogs.actions.pageLayout.title'
                )
              }}
            </h2>
            <p>
              {{
                $t(
                  'components.storyPageEditor.dialogs.actions.pageLayout.description'
                )
              }}
            </p>
            <div class="settings-container">
              <button @click="handleChangeLayout('image-over-text')">
                <Icon
                  name="custom:image-plus-text"
                  class="image-text-icon"
                />
                <span
                  :class="{
                    highlight:
                      layout === 'image-over-text' ||
                      layout === 'text-over-image',
                  }"
                >
                  {{
                    $t(
                      'components.storyPageEditor.dialogs.actions.pageLayout.imageAndText'
                    )
                  }}
                </span>
              </button>
              <div class="image-text-options">
                <BaseCheckbox
                  id="image-over-text"
                  v-model="imageOverText"
                  :label="
                    $t(
                      'components.storyPageEditor.dialogs.actions.pageLayout.imageOverText'
                    )
                  "
                  value="image-over-text"
                  :disabled="
                    layout !== 'text-over-image' && layout !== 'image-over-text'
                  "
                  @update:model-value="handleCheckboxChange('image-over-text')"
                />
                <BaseCheckbox
                  id="text-over-image"
                  v-model="textOverImage"
                  :label="
                    $t(
                      'components.storyPageEditor.dialogs.actions.pageLayout.textOverImage'
                    )
                  "
                  value="text-over-image"
                  :disabled="
                    layout !== 'text-over-image' && layout !== 'image-over-text'
                  "
                  @update:model-value="handleCheckboxChange('text-over-image')"
                />
              </div>
              <button @click="handleChangeLayout('image')">
                <Icon name="mdi:image-outline" />
                <span
                  :class="{
                    highlight: layout === 'image',
                  }"
                >
                  {{
                    $t(
                      'components.storyPageEditor.dialogs.actions.pageLayout.onlyImage'
                    )
                  }}
                </span>
              </button>
              <button @click="handleChangeLayout('text')">
                <Icon name="mdi:text" />
                <span
                  :class="{
                    highlight: layout === 'text',
                  }"
                >
                  {{
                    $t(
                      'components.storyPageEditor.dialogs.actions.pageLayout.onlyText'
                    )
                  }}
                </span>
              </button>
            </div>
          </div>
        </BaseDialog>

        <BaseButton
          variant="icon"
          type="secondary"
          :icon="action.icon"
          class="action-button"
          @click="action.action"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .page-editor-container {
    position: relative;
    border: 1px solid var(--color-black);

    &::before {
      position: absolute;
      top: 5px;
      left: -5px;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: '';
      background: var(--color-black);
    }
  }

  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--color-beige);

    &.text-over-image {
      flex-direction: column-reverse;
    }
  }

  .image-title-container,
  .text-container {
    width: 100%;
    height: 50%;
  }

  .image-title-container {
    position: relative;

    &.full-height {
      height: 100%;
    }

    &.min-height {
      height: 30%;
    }

    .image-container,
    .title-box {
      position: absolute;
    }

    .image-container {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title-box {
      bottom: 20px;
      left: var(--padding-mobile);
      width: 60%;
      min-width: 300px;
      max-width: 400px;
      height: fit-content;

      &.top-aligned {
        top: 20px;
      }

      &.bottom-aligned {
        bottom: 20px;
      }

      h1 {
        font-size: 1.2rem;
      }

      .title-box-content {
        padding: var(--padding-mobile);

        .author-info {
          display: flex;
          gap: 0.3em;
          align-items: center;
        }

        .name {
          font-style: italic;
        }

        .date {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .story-details-edit-button {
          position: absolute;
          top: var(--padding-mobile);
          right: var(--padding-mobile);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
          font-size: 1rem;
          cursor: pointer;
          background: none;
          border: none;
        }
      }
    }
  }

  .text-container {
    box-sizing: border-box;
    width: 100%;
    height: 50%;
    padding: 2rem var(--padding-mobile);

    textarea {
      width: 100%;
      height: 100%;
      font-family: var(--font-link);
      font-size: 1rem;
      color: var(--color-black);
      resize: none;
      outline: none;
      background: none;
      border: none;
    }

    &.full-height {
      height: 100%;
    }
  }

  .divider {
    position: absolute;
    top: calc(50% - 15px);
    width: 100%;
    height: 30px;
  }

  .story-actions {
    position: relative;
    z-index: 1000;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    height: 40px;
    padding: 0 var(--padding-mobile);
    margin: 0 auto;
    transform: translateY(-20px);

    .action-wrapper {
      position: relative;
    }

    .action-button {
      width: 40px;
      height: 40px;
    }
  }

  .dialog-content {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;

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

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    h2,
    p {
      font-size: 0.8rem;
    }
  }

  .dialog {
    position: absolute;
    bottom: 50px;
    left: 50%;
    height: 100px;
    transform: translateX(-50%);

    &.delete {
      width: 25vw;
      min-width: 250px;
    }

    &.add {
      width: 40vw;
      min-width: 360px;
      max-width: 400px;
      height: 110px;

      @media screen and (max-width: 360px) {
        width: 25vw;
        min-width: 250px;
        height: 200px;

        .dialog-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;

          button:nth-child(3) {
            display: flex;
            grid-column: 1 / 3;
            align-items: center;
            justify-content: center;
            justify-self: center;
            width: 50%;
          }
        }
      }
    }

    &.save-submit {
      width: 25vw;
      min-width: 250px;
    }

    &.settings {
      left: 50%;
      width: 50vw;
      min-width: 300px;
      max-width: 400px;
      height: 280px;
      transform: translateX(-95%);

      .dialog-content {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }

      .settings-container {
        display: grid;
        grid-template-columns: 1.5fr 2fr;
        width: 100%;

        button {
          justify-self: center;
        }
      }

      .image-text-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .image-text-icon {
        width: 40px;
      }
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
    }
  }

  .save-changes-loading-container,
  .save-changes-loading {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: var(--font-link);

    span {
      font-size: 0.8rem;
      line-height: 1rem;
      text-align: center;
    }

    .spinner {
      width: 10px;
      height: 10px;
      border: 2px solid var(--color-black);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;

      @media screen and (prefers-reduced-motion: reduce) {
        width: 10px;
        height: 10px;
        background: var(--color-black);
        border-radius: 50%;
        animation: none;
      }
    }
  }

  .save-changes-loading {
    opacity: 0.5;
  }

  @keyframes spin {
    /* stylelint-disable-next-line plugins/no-unused-selectors */
    0% {
      transform: rotate(0deg);
    }

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    100% {
      transform: rotate(360deg);
    }
  }
</style>
