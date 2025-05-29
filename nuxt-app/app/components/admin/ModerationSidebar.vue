<script lang="ts" setup>
  import type { Story } from '~/types/frontend'

  defineProps<{
    story: Story | null
    isOpen: boolean
    isFeatured: boolean
    quote: string
  }>()

  interface Emits {
    (e: 'update:isOpen' | 'update:isFeatured', value: boolean): void
    (e: 'update:quote', value: string): void
    (e: 'approve' | 'reject' | 'return'): void
  }
  const emit = defineEmits<Emits>()

  const shapeClipPath = ref('')
  const buttonClipPath = ref('')

  // Base points for the irregular shape (x, y coordinates in percentages)
  const baseClipPathPoints: Array<[number, number]> = [
    [5, 0], // Top-left start
    [50, 0.4], // Top-left curve
    [100, 0], // Top-right
    [100, 98.9], // Bottom-right
    [100, 98.9], // Bottom curve
    [15, 98.9], // Bottom-left
    [0, 98.9], // Left curve bottom
    [0, 5], // Left curve top
    [5, 0], // Back to start
  ]

  // Base points for the button shape (x, y coordinates in percentages)
  const baseButtonClipPathPoints: Array<[number, number]> = [
    [0, 20], // Left point (tip of the triangle)
    [100, 0], // Top-right corner
    [100, 100], // Bottom-right corner
    [10, 85], // Back to the tip
  ]

  function randomizeClipPath(): string {
    return baseClipPathPoints
      .map(([x, y]) => {
        const jitter = 1 // Smaller jitter for more subtle effect
        return `${x + (Math.random() - 0.5) * jitter}% ${y + (Math.random() - 0.5) * jitter}%`
      })
      .join(', ')
  }

  function randomizeButtonClipPath(): string {
    return baseButtonClipPathPoints
      .map(([x, y]) => {
        const jitter = 1
        return `${x + (Math.random() - 0.5) * jitter}% ${y + (Math.random() - 0.5) * jitter}%`
      })
      .join(', ')
  }

  onMounted(() => {
    // Initialize clip paths
    shapeClipPath.value = `polygon(${randomizeClipPath()})`
    buttonClipPath.value = `polygon(${randomizeButtonClipPath()})`
  })

  function handleApproveClick() {
    emit('approve')
  }

  function handleRejectClick() {
    emit('reject')
  }

  function handleReturnClick() {
    emit('return')
  }
</script>

<template>
  <div
    class="sidebar-container"
    :class="{ 'sidebar-closed': !isOpen }"
  >
    <button
      class="toggle-button"
      :style="{ clipPath: buttonClipPath }"
      @click="emit('update:isOpen', !isOpen)"
    >
      <span class="toggle-icon">
        {{ isOpen ? '›' : '‹' }}
      </span>
    </button>
    <div class="sidebar">
      <div class="halftone background" />
      <div class="sidebar-inner">
        <div
          v-if="story"
          class="sidebar-content"
        >
          <h2>Geschichte-Details</h2>

          <div class="story-info">
            <h3>{{ story.title }}</h3>

            <div class="info-group">
              <span>Autor:</span>
              <p>{{ story.author.name }}</p>
              <p class="email">{{ story.author.email }}</p>
            </div>

            <div class="info-group">
              <span>Jahre:</span>
              <p>{{ story.year }}</p>
            </div>

            <div class="info-group">
              <span>Sprache:</span>
              <p>{{ story.locale }}</p>
            </div>

            <div class="info-group">
              <span>Erstellt:</span>
              <p>
                {{
                  new Date(story.createdAt || '').toLocaleDateString('de-DE')
                }}
              </p>
            </div>

            <div class="info-group">
              <span>Status:</span>
              <p
                class="status"
                :class="story.status"
              >
                {{ story.status }}
              </p>
            </div>

            <div class="info-group">
              <label
                class="checkbox-label"
                for="isFeatured"
              >
                <input
                  id="isFeatured"
                  :value="isFeatured"
                  type="checkbox"
                  @input="
                    emit(
                      'update:isFeatured',
                      ($event.target as HTMLInputElement).checked
                    )
                  "
                />
                Vorgestellt
              </label>
            </div>

            <div class="info-group">
              <label for="quote">
                Zitat:
                <textarea
                  id="quote"
                  :value="quote"
                  rows="4"
                  placeholder="Gib ein Zitat aus der Geschichte ein..."
                  @input="
                    emit(
                      'update:quote',
                      ($event.target as HTMLTextAreaElement).value
                    )
                  "
                />
              </label>
            </div>
          </div>

          <div class="action-buttons">
            <button
              class="approve-button"
              :disabled="story.status === 'approved'"
              @click="handleApproveClick"
            >
              Freigeben
            </button>

            <button
              class="reject-button"
              :disabled="story.status === 'rejected'"
              @click="handleRejectClick"
            >
              Ablehnen
            </button>

            <button
              class="return-button"
              @click="handleReturnClick"
            >
              Zurück zum Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* stylelint-disable-next-line plugins/no-unused-selectors */
  * {
    --sidebar-width: 320px;
    --sidebar-padding: 20px;
  }

  .toggle-button {
    position: absolute;
    top: calc(50% - 20px);
    left: -29px;
    z-index: 101;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 40px;
    padding: 0;
    font-size: 24px;
    color: var(--color-text);
    cursor: pointer;
    outline: none;
    background-color: var(--color-background-light);
    border: none;

    .toggle-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transform: translateX(25%);
    }
  }

  .sidebar-container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    box-sizing: border-box;
    width: calc(var(--sidebar-width));
    height: fit-content;
    min-height: 700px;
    max-height: 100%;
    filter: drop-shadow(-8px 4px 0 var(--color-black));
    transform: translateX(0);
    transition: transform 0.3s ease;

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .sidebar-closed {
    transform: translateX(calc(var(--sidebar-width)));

    .toggle-button .toggle-icon {
      transform: translateX(0);
    }
  }

  .sidebar {
    position: relative;
    display: grid;
    width: var(--sidebar-width);
    height: fit-content;
    min-height: 700px;
    background-color: var(--color-background-light);
    clip-path: v-bind(shapeClipPath);
  }

  .background {
    position: absolute;
    inset: 0;
    z-index: -1;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .sidebar-inner {
    position: relative;
    z-index: 1;
    grid-area: 1 / 1;
    height: fit-content;
    padding: var(--sidebar-padding);
  }

  .sidebar-content {
    height: fit-content;
    max-height: calc(
      100vh - var(--header-height) - (var(--sidebar-padding) * 2)
    );
    overflow-y: auto;
  }

  .story-info {
    margin-top: 20px;

    h3 {
      margin-bottom: 20px;
      font-size: 1.2rem;
    }
  }

  .info-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-size: 0.9rem;
      color: var(--color-text-light);
    }

    p {
      margin: 0;
    }

    .email {
      font-size: 0.9rem;
      color: var(--color-text-light);
    }
  }

  .status {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.9rem;
    border-radius: 4px;

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.submitted {
      color: var(--color-text);
      background-color: var(--color-background);
    }

    &.approved {
      color: var(--color-success-dark);
      background-color: var(--color-success-light);
    }

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.rejected {
      color: var(--color-error-dark);
      background-color: var(--color-error-light);
    }
  }

  .checkbox-label {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;

    input[type='checkbox'] {
      width: 16px;
      height: 16px;
    }
  }

  textarea {
    width: calc(100% - var(--sidebar-padding));
    padding: 8px;
    font-family: inherit;
    resize: none;
    border: 1px solid var(--color-black);
    border-radius: 4px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;

    button {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: 4px;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  .approve-button {
    color: white;
    background-color: var(--color-success);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: var(--color-success-dark);
    }
  }

  .reject-button {
    color: white;
    background-color: var(--color-error);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: var(--color-error-dark);
    }
  }

  .return-button {
    color: var(--color-text);
    background-color: var(--color-background);
    border: 1px solid var(--color-black);

    &:hover,
    &:focus {
      background-color: var(--color-background-light);
    }
  }
</style>
