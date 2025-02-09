<script setup lang="ts">
  import { BaseButton } from '#components'
  import type { PageLayout, StoryPage } from '~/types'
  const props = defineProps<{
    page: StoryPage
    title: string
    author: string
    date: Date
  }>()

  const pageLayout = ref<PageLayout>('image-over-text')
  const imageOverText = ref<boolean>(true)
  const textOverImage = ref<boolean>(false)

  watch(imageOverText, (newValue) => {
    if (
      !newValue &&
      !textOverImage.value &&
      (pageLayout.value === 'image-over-text' ||
        pageLayout.value === 'text-over-image')
    ) {
      imageOverText.value = true
      return
    }
    if (newValue) {
      textOverImage.value = false
      pageLayout.value = 'image-over-text'
    }
  })

  watch(textOverImage, (newValue) => {
    if (
      !newValue &&
      !imageOverText.value &&
      (pageLayout.value === 'image-over-text' ||
        pageLayout.value === 'text-over-image')
    ) {
      textOverImage.value = true
      return
    }
    if (newValue) {
      imageOverText.value = false
      pageLayout.value = 'text-over-image'
    }
  })

  watch(pageLayout, (newValue) => {
    if (newValue === 'image-over-text') {
      imageOverText.value = true
      textOverImage.value = false
    } else if (newValue === 'text-over-image') {
      textOverImage.value = true
      imageOverText.value = false
    }
  })

  const placeholderImage = '/imgs/page-placeholder-image.jpg'

  const pageImage = computed(() => {
    return props.page.image ? props.page.image : placeholderImage
  })

  const deleteDialogOpen = ref(false)
  const addDialogOpen = ref(false)
  const saveSubmitDialogOpen = ref(false)
  const settingsDialogOpen = ref(false)

  const editorMenu = [
    {
      id: 'close',
      icon: 'mdi:close',
      action: () => console.log('Close editor'),
    },
    {
      id: 'delete',
      icon: 'mdi:delete',
      action: () => {
        deleteDialogOpen.value = true
      },
    },
    {
      id: 'add',
      icon: 'mdi:add',
      action: () => {
        addDialogOpen.value = true
      },
    },
    {
      id: 'save-submit',
      icon: 'custom:save-submit',
      action: () => {
        saveSubmitDialogOpen.value = true
      },
    },
    {
      id: 'settings',
      icon: 'mdi:settings',
      action: () => {
        settingsDialogOpen.value = true
      },
    },
  ]
</script>

<template>
  <div
    class="page-container"
    :style="{}"
  >
    <div
      class="page-content"
      :class="{ 'text-over-image': textOverImage }"
    >
      <div
        class="image-title-container"
        :class="{
          'full-height': pageLayout === 'image',
          'min-height': pageLayout === 'text',
        }"
      >
        <div
          v-if="pageLayout !== 'text'"
          class="image-container"
        >
          <NuxtImg
            :src="pageImage"
            alt="Story page image"
          />
        </div>
        <CutoutShape
          shape-class="shape-textbox-1"
          color="pink"
          purpose="textbox"
          :shadow="true"
          class="title-box"
          :class="{
            'top-aligned': textOverImage,
            'bottom-aligned': imageOverText,
          }"
        >
          <div class="title-box-content">
            <h1>{{ title }}</h1>
            <div class="author-info">
              <span>{{ $t('components.storyPageEditor.byAuthor') }}</span>
              <span class="name">{{ author }}</span>
            </div>
            <div class="date">
              <Icon name="mdi:calendar-month" />
              {{ date.getFullYear() }}
            </div>
            <button
              class="story-details-edit-button"
              @click="console.log('Edit title')"
            >
              <Icon name="mdi:edit" />
            </button>
          </div>
        </CutoutShape>
      </div>

      <label
        v-if="pageLayout !== 'image'"
        for="page-text-input"
        class="text-container"
        :class="{
          'full-height': pageLayout === 'text',
        }"
      >
        <textarea
          id="page-text-input"
          :placeholder="$t('components.storyPageEditor.pageTextPlaceholder')"
        />
      </label>
    </div>

    <StoryPageDivider
      v-if="
        pageLayout === 'image-over-text' || pageLayout === 'text-over-image'
      "
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
          v-model="deleteDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog delete"
        >
          <div class="dialog-content">
            <button>
              <Icon name="mdi:close-box-outline" />
              {{ $t('components.storyPageEditor.deletePage') }}
            </button>
            <button>
              <Icon name="mdi:delete-outline" />
              {{ $t('components.storyPageEditor.deleteStory') }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'add'"
          v-model="addDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog add"
        >
          <div class="dialog-content">
            <button>
              <Icon name="mdi:image-plus-outline" />
              {{ $t('components.storyPageEditor.addImage') }}
            </button>
            <button>
              <Icon name="mdi:note-plus-outline" />
              {{ $t('components.storyPageEditor.addPage') }}
            </button>
            <button>
              <Icon name="mdi:shape-polygon-plus" />
              {{ $t('components.storyPageEditor.addSticker') }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'save-submit'"
          v-model="saveSubmitDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-center"
          class="dialog save-submit"
        >
          <div class="dialog-content">
            <button>
              <Icon name="mdi:content-save-outline" />
              {{ $t('components.storyPageEditor.saveChanges') }}
            </button>
            <button>
              <Icon name="mdi:send-variant-outline" />
              {{ $t('components.storyPageEditor.submitStory') }}
            </button>
          </div>
        </BaseDialog>

        <BaseDialog
          v-if="action.id === 'settings'"
          v-model="settingsDialogOpen"
          :modal="false"
          speech-bubble-position="bottom-right"
          class="dialog settings"
        >
          <div class="dialog-content">
            <h2>{{ $t('components.storyPageEditor.configurePageTitle') }}</h2>
            <p>{{ $t('components.storyPageEditor.selectLayout') }}</p>
            <div class="settings-container">
              <button @click="pageLayout = 'image-over-text'">
                <Icon
                  name="custom:image-plus-text"
                  class="image-text-icon"
                />
                <span
                  :class="{
                    highlight:
                      pageLayout === 'image-over-text' ||
                      pageLayout === 'text-over-image',
                  }"
                >
                  {{ $t('components.storyPageEditor.imageAndText') }}
                </span>
              </button>
              <div class="image-text-options">
                <BaseCheckbox
                  id="image-over-text"
                  v-model:checked="imageOverText"
                  :label="$t('components.storyPageEditor.imageOverText')"
                  value="image-over-text"
                  :disabled="
                    pageLayout !== 'text-over-image' &&
                    pageLayout !== 'image-over-text'
                  "
                />
                <BaseCheckbox
                  id="text-over-image"
                  v-model:checked="textOverImage"
                  :label="$t('components.storyPageEditor.textOverImage')"
                  value="text-over-image"
                  :disabled="
                    pageLayout !== 'text-over-image' &&
                    pageLayout !== 'image-over-text'
                  "
                />
              </div>
              <button @click="pageLayout = 'image'">
                <Icon name="mdi:image-outline" />
                <span
                  :class="{
                    highlight: pageLayout === 'image',
                  }"
                >
                  {{ $t('components.storyPageEditor.onlyImage') }}
                </span>
              </button>
              <button @click="pageLayout = 'text'">
                <Icon name="mdi:text" />
                <span
                  :class="{
                    highlight: pageLayout === 'text',
                  }"
                >
                  {{ $t('components.storyPageEditor.onlyText') }}
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
  .page-container {
    position: relative;
    min-width: 350px;
    max-width: 500px;
    border: 1px solid var(--black);

    &::before {
      position: absolute;
      top: 5px;
      left: -5px;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: '';
      background: var(--black);
    }
  }

  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--light-beige);

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
      left: var(--padding);
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
        padding: var(--padding);

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
          top: var(--padding);
          right: var(--padding);
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
    padding: 2rem var(--padding);

    textarea {
      width: 100%;
      height: 100%;
      font-family: var(--link-font);
      font-size: 1rem;
      color: var(--black);
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
    padding: 0 var(--padding);
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
      font-family: var(--link-font);
      font-size: 0.8rem;
      color: var(--black);
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
  }
</style>
