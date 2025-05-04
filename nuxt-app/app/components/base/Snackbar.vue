<script setup lang="ts">
  const props = defineProps<{
    message: string
    timeout?: number
  }>()

  const open = defineModel<boolean>({ default: false })
  const snackbarRef = ref<HTMLDialogElement | null>(null)
  const shapeClipPath = ref('')
  let timeoutId: NodeJS.Timeout | null = null

  function close() {
    open.value = false
  }

  watch(open, (isOpen) => {
    if (isOpen) {
      snackbarRef.value?.showModal()
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      // Set new timeout to close after 5 seconds
      timeoutId = setTimeout(() => {
        close()
      }, props.timeout ?? 5000)
    } else {
      snackbarRef.value?.close()
      // Clear timeout when closing
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
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

  function randomizeClipPath() {
    return baseClipPathPoints
      .map(([x, y]) => {
        const jitter = 2
        return `${x! + (Math.random() - 0.5) * jitter}% ${y! + (Math.random() - 0.5) * jitter}%`
      })
      .join(', ')
  }

  onMounted(() => {
    shapeClipPath.value = `polygon(${randomizeClipPath()})`
  })

  onUnmounted(() => {
    // Clear timeout when component is unmounted
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  onClickOutside(snackbarRef, () => {
    open.value = false
  })
</script>

<template>
  <Teleport to="#teleports">
    <dialog ref="snackbarRef">
      <div class="snackbar-container">
        <div
          class="snackbar-content"
          :style="{ clipPath: shapeClipPath }"
        >
          <div
            class="halftone background"
            :style="{ clipPath: shapeClipPath }"
          ></div>
          <button
            class="close-button"
            @click="close"
          >
            <Icon name="mdi:close" />
          </button>

          <div class="snackbar-message">
            {{ message }}
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
  dialog {
    z-index: 1000;
    width: 100%;
    height: 100%;
    padding: 0;
    pointer-events: none;
    background: transparent;
    border: none;

    &::backdrop {
      visibility: hidden;
    }
  }

  .snackbar-container {
    position: absolute;
    bottom: 12dvh;
    left: 50%;
    width: min(60vw, 300px); /* Default width */
    height: fit-content; /* Change from fixed height to fit-content */
    min-height: 100px; /* Add a minimum height */
    margin: auto; /* Center the modal */
    pointer-events: auto;
    background: transparent;
    filter: drop-shadow(-5px 5px 0 rgb(0 0 0 / 100%));
    transform: translateX(-50%);
  }

  .snackbar-content {
    position: relative;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: var(--padding-mobile);
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    background-color: var(--color-white);

    &.halftone {
      --opacity: 0.8;

      &::after {
        height: 300%;
      }
    }
  }

  .close-button {
    position: absolute;
    top: calc(var(--padding-mobile) * 1.2);
    right: var(--padding-mobile);
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-black);
    cursor: pointer;
    background: none;
    border: none;
  }
</style>
