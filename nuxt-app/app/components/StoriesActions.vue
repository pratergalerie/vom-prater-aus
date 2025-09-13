<script lang="ts" setup>
interface Props {
  viewMode: 'list' | 'explorer'
  showSearchDialog: boolean
}

interface Emits {
  (e: 'update:viewMode', value: 'list' | 'explorer'): void
  (e: 'update:showSearchDialog', value: boolean): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="actions-container">
    <div class="actions-controls">
      <BaseButton
        icon="mdi:search"
        type="primary"
        variant="icon"
        @click="$emit('update:showSearchDialog', true)"
      />
      <div class="view-mode-switcher-container">
        <StoriesViewSwitcher
          :mode="viewMode"
          list-icon="mdi:view-list"
          explorer-icon="mdi:view-grid"
          :list-label="$t('components.storiesViewSwitcher.list')"
          :explorer-label="$t('components.storiesViewSwitcher.explorer')"
          @update:mode="$emit('update:viewMode', $event)"
        />
        <div class="current-mode-label">
          <span>
            {{
              viewMode === 'explorer'
                ? $t('pages.stories.index.viewMode.explorer')
                : $t('pages.stories.index.viewMode.list')
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions-container {
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
}

.actions-controls {
  box-sizing: border-box;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-s) 0;
}

.view-mode-switcher-container {
  display: flex;
  gap: 1rem;
}

.current-mode-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  font-family: var(--font-button);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .actions-container {
    justify-content: center;
    width: 100%;
  }

  .view-mode-switcher-container {
    gap: 0.5rem;
    align-items: center;
  }

  .current-mode-label {
    font-size: 12px;
  }
}
</style>