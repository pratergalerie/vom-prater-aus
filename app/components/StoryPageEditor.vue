<script setup lang="ts">
  import { BaseButton } from '#components'
  import type { StoryPage } from '~/types'
  import { LayoutTypes } from '~/types'
  const props = defineProps<{
    page: StoryPage
    title: string
    author: string
    date: Date
  }>()

  const pageLayout = computed(() => {
    if (props.page.layout === LayoutTypes.IMAGE_OVER_TEXT) {
      return 'image-over-text'
    }
    return 'image-over-text'
  })

  const placeholderImage = '/imgs/page-placeholder-image.jpg'

  const pageImage = computed(() => {
    return props.page.image ? props.page.image : placeholderImage
  })

  const editorMenu = [
    {
      icon: 'close',
      action: () => console.log('Close editor'),
    },
    {
      icon: 'delete',
      action: () => {
        console.log('Delete')
        deleteDialogOpen.value = true
      },
    },
    {
      icon: 'add',
      action: () => console.log('Add'),
    },
    {
      icon: 'custom:save-submit',
      action: () => console.log('Submit'),
    },
    {
      icon: 'settings',
      action: () => console.log('Settings'),
    },
  ]

  const deleteDialogOpen = ref(false)
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
      <BaseButton
        v-for="action in editorMenu"
        :key="action.icon"
        variant="icon"
        type="secondary"
        :icon="action.icon"
        class="action-button"
        @click="action.action"
      />
    </div>
    <BaseDialog
      v-model="deleteDialogOpen"
      :modal="false"
    >
      <p>Dialog content</p>
    </BaseDialog>
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
        z-index: 1;
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

    .action-button {
      width: 40px;
      height: 40px;
    }
  }
</style>
