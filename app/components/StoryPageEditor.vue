<script setup lang="ts">
  import { BaseButton } from '#components'
  import { type StoryPage, LayoutTypes } from '~/types'
  const props = defineProps<{
    page: StoryPage
    title: string
    author: string
    date: Date
  }>()

  const pageLayout = ref<LayoutTypes>(LayoutTypes.IMAGE_OVER_TEXT)
  const imageOverText = ref<boolean>(true)
  const textOverImage = ref<boolean>(false)

  watchEffect(() => {
    if (imageOverText.value) {
      pageLayout.value = LayoutTypes.IMAGE_OVER_TEXT
      textOverImage.value = false
    } else if (textOverImage.value) {
      pageLayout.value = LayoutTypes.TEXT_OVER_IMAGE
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
      icon: 'close',
      action: () => console.log('Close editor'),
    },
    {
      id: 'delete',
      icon: 'delete',
      action: () => {
        deleteDialogOpen.value = true
      },
    },
    {
      id: 'add',
      icon: 'add',
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
      icon: 'settings',
      action: () => {
        settingsDialogOpen.value = true
      },
    },
  ]
</script>

<template>
  <div
    class="editor-container"
    :style="{}"
  >
    <div class="image-title-container">
      <div class="image-container">
        <NuxtImg
          :src="pageImage"
          alt="Story page image"
        />
      </div>
      <div class="title-box">
        <div class="title-box-content">
          <h1>{{ title }}</h1>
          <div class="author-info">
            <span>Eine Geschichte von </span>
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
        <NuxtImg
          class="background"
          src="/svgs/page-editor/title-box.svg"
          alt="Story title box background"
        />
      </div>
      <NuxtImg
        class="divider"
        src="/svgs/page-editor/divider.svg"
        alt="divider"
      />
    </div>
    <label
      for="page-text-input"
      class="text-container"
    >
      <textarea
        id="page-text-input"
        placeholder="Gib den Text für die Story-Seite ein"
      />
    </label>

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
              Seite löschen
            </button>
            <button>
              <Icon name="mdi:delete-outline" />
              Geschichte löschen
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
              Bild hinzufügen/ändern
            </button>
            <button>
              <Icon name="mdi:note-plus-outline" />
              Seite hinzufügen
            </button>
            <button>
              <Icon name="mdi:shape-polygon-plus" />
              Sticker hinzufügen
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
              Änderungen speichern
            </button>
            <button>
              <Icon name="mdi:send-variant-outline" />
              Geschichte einreichen
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
            <h2>Seite konfigurieren</h2>
            <p>Wähle ein Layout aus</p>
            <div class="settings-container">
              <button>
                <Icon
                  name="mdi:image-text"
                  class="image-text-icon"
                />
                Bild und Text
              </button>
              <div class="image-text-options">
                <BaseCheckbox
                  id="image-over-text"
                  v-model:checked="imageOverText"
                  label="Bild über Text"
                  value="image-over-text"
                />
                <BaseCheckbox
                  id="text-over-image"
                  v-model:checked="textOverImage"
                  label="Text über Bild"
                  value="text-over-image"
                />
              </div>
              <button>
                <Icon name="mdi:image-outline" />
                Nur Bild
              </button>
              <button>
                <Icon name="mdi:text" />
                Nur Text
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
  .editor-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 350px;
    max-width: 500px;
    border: 1px solid var(--black);
  }

  .image-title-container,
  .text-container {
    width: 100%;
    height: 50%;
  }

  .image-title-container {
    position: relative;

    .image-container,
    .title-box,
    .divider {
      position: absolute;
    }

    .image-container {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .title-box {
      bottom: -20px;
      left: var(--padding);
      display: grid;
      width: 60%;
      min-width: 300px;
      max-width: 400px;

      h1 {
        font-size: 1.2rem;
      }

      .title-box-content,
      .background {
        grid-area: 1/1;
      }

      .title-box-content {
        z-index: 0;
        padding: var(--padding);

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

    .divider {
      bottom: -30px;
      width: 100%;
    }
  }

  .text-container {
    box-sizing: border-box;
    width: 100%;
    height: 50%;
    padding: 1rem;

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
  }

  .story-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    max-width: 500px;
    height: 40px;
    transform: translateY(20px);

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
      background: none;
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
    min-width: 50px;
    height: 100px;
    transform: translateX(-50%);

    &.delete {
      width: 250px;
    }

    &.add {
      width: 350px;
      height: 110px;
    }

    &.save-submit {
      width: 250px;
    }

    &.settings {
      left: 50%;
      width: 280px;
      height: 250px;
      transform: translateX(-95%);

      .dialog-content {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }

      .settings-container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
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
        font-size: 1.6rem;
      }
    }
  }
</style>
