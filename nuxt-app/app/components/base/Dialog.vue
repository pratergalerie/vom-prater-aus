<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      title?: string
      width?: number | string
      minWidth?: number | string
      backdrop?: boolean
      modal?: boolean
      top?: number | string
      left?: number | string
      right?: number | string
      bottom?: number | string
      transform?: string
      speechBubblePosition?:
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right'
        | undefined
    }>(),
    {
      title: '',
      width: 300,
      minWidth: 200,
      height: 100,
      backdrop: true,
      modal: true,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: 'none',
      speechBubblePosition: undefined,
    }
  )

  const isOpen = defineModel<boolean>('is-open', { default: false })

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const shapeClipPath = ref('')
  const originalBodyStyle = ref<string>('')

  function close() {
    if (dialogRef.value) {
      isOpen.value = false
    }
  }

  function lockScroll() {
    // Store the original body style
    originalBodyStyle.value = document.body.style.overflow
    // Prevent scrolling
    document.body.style.overflow = 'hidden'
  }

  function unlockScroll() {
    // Restore the original body style
    document.body.style.overflow = originalBodyStyle.value
  }

  onMounted(() => {
    // Initialize clip path
    shapeClipPath.value = `polygon(${randomizeClipPath()})`

    // Add close on ESC key
    dialogRef.value?.addEventListener('cancel', (event) => {
      event.preventDefault()
      close()
    })
  })

  onUnmounted(() => {
    dialogRef.value?.removeEventListener('cancel', close)
    // Ensure scroll is unlocked when component is unmounted
    unlockScroll()
  })

  watch(isOpen, (newValue) => {
    if (!dialogRef.value) return

    if (newValue && !dialogRef.value.open) {
      if (props.modal) {
        dialogRef.value.showModal()
        lockScroll()
      } else {
        dialogRef.value.show()
        lockScroll()
      }
    } else if (!newValue && dialogRef.value.open) {
      dialogRef.value.close()
      unlockScroll()
    }
  })

  const baseClipPathPoints = [
    [0, 2],
    [0, 95],
    [42, 100],
    [85, 98],
    [99, 90],
    [99, 5],
    [70, 3],
    [35, 5],
    [0, 2],
  ]

  const dialogWidth = computed(() => {
    // Return a width within the range of 200px to 600px
    if (typeof props.width === 'number') {
      return `${Math.min(Math.max(props.width, 200), 600)}px`
    }
    return props.width
  })

  const dialogMinWidth = computed(() => {
    if (typeof props.minWidth === 'number') {
      return `${Math.min(Math.max(props.minWidth, 200), 600)}px`
    }
    return props.minWidth
  })

  const dialogTop = computed(() => {
    if (typeof props.top === 'number') {
      return `${props.top}px`
    }
    return props.top
  })

  const dialogLeft = computed(() => {
    if (typeof props.left === 'number') {
      return `${props.left}px`
    }
    return props.left
  })

  const dialogRight = computed(() => {
    if (typeof props.right === 'number') {
      return `${props.right}px`
    }
    return props.right
  })

  const dialogBottom = computed(() => {
    if (typeof props.bottom === 'number') {
      return `${props.bottom}px`
    }
    return props.bottom
  })

  const dialogTransform = computed(() => {
    if (typeof props.transform === 'string') {
      return props.transform
    }
    return 'none'
  })

  function randomizeClipPath() {
    return baseClipPathPoints
      .map(([x, y]) => {
        const jitter = 2
        return `${x! + (Math.random() - 0.5) * jitter}% ${y! + (Math.random() - 0.5) * jitter}%`
      })
      .join(', ')
  }
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="{ 'absolute-position': !modal }"
  >
    <div class="dialog-wrapper">
      <div class="dialog-content">
        <div class="halftone background" />
        <div class="dialog-content-inner">
          <div class="header">
            <h2 v-if="title">{{ title }}</h2>
            <button
              type="button"
              class="close-button"
              @click="close"
            >
              <Icon name="mdi:close" />
            </button>
          </div>
          <slot />
        </div>
      </div>

      <div
        v-if="speechBubblePosition"
        class="speech-bubble"
        :class="speechBubblePosition"
      />
    </div>
  </dialog>
</template>

<style scoped>
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: v-bind(dialogWidth);
    min-width: v-bind(dialogMinWidth);
    height: fit-content;
    max-height: 90vh;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    transform: translate(-50%, -50%);
    container-type: inline-size;
    container-name: dialog-container;

    &::backdrop {
      background: rgb(0 0 0 / 50%);
    }

    &.absolute-position {
      position: absolute;
      inset: v-bind(dialogTop) v-bind(dialogRight) v-bind(dialogBottom)
        v-bind(dialogLeft);
      z-index: 1000;
      transform: v-bind(dialogTransform);
    }
  }

  .dialog-wrapper {
    position: relative;
    width: calc(100% - 16px);
    filter: drop-shadow(-8px 8px 0 var(--color-black));
    transform: translate(8px, 0);
  }

  .dialog-content {
    position: relative;
    width: 100%;
    background-color: var(--color-white);
    clip-path: v-bind(shapeClipPath);
  }

  .background {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }

  .dialog-content-inner {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;

    /* If no title, remove the gap between the header and the content */
    &:not(:has(h2)) {
      gap: 0;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.5rem;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.4rem;
    }

    /* If no title, align the close button to the right */
    &:not(:has(h2)) {
      justify-content: flex-end;
    }
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-black);
    cursor: pointer;
    background: none;
    border: none;
  }

  .speech-bubble {
    position: absolute;
    bottom: -10px;
    z-index: -1;
    width: 0;
    height: 0;
    border-color: var(--color-white) transparent transparent transparent;
    border-style: solid;
    border-width: 12px 10px 0;

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.bottom-left {
      left: 20px;
      filter: drop-shadow(-3px -2px 0 var(--color-black));
      transform: translateY(-5px) rotate(-90deg);
      scale: 2;
    }

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.bottom-center {
      left: 50%;
      filter: drop-shadow(-1px 3px 0 var(--color-black));
      transform: translateX(-26%) skew(-0.02turn, 5deg);
      scale: 2;
    }

    /* stylelint-disable-next-line plugins/no-unused-selectors */
    &.bottom-right {
      right: 30px;
      filter: drop-shadow(3px -1px 0 var(--color-black));
      transform: translateY(-7px) rotate(90deg);
      scale: 3;
    }
  }
</style>
