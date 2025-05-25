<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean
    imageSrc: string
    imageAlt: string
  }>()

  const emit = defineEmits(['close'])

  const imageRef = ref<HTMLImageElement | null>(null)
  const containerRef = ref<HTMLButtonElement | null>(null)
  const scale = ref(1)
  const position = ref({ x: 0, y: 0 })
  const isDragging = ref(false)
  const dragStart = ref({ x: 0, y: 0 })
  const lastTouchDistance = ref(0)

  function handleClose() {
    emit('close')
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault()
    const delta = event.deltaY
    const zoomFactor = delta > 0 ? 0.9 : 1.1
    const newScale = scale.value * zoomFactor
    scale.value = Math.min(Math.max(newScale, 1), 4)
  }

  function handleZoomClick() {
    const newScale = scale.value * 1.1
    scale.value = Math.min(Math.max(newScale, 1), 4)
  }

  function handleMouseDown(event: MouseEvent) {
    if (scale.value <= 1) return
    isDragging.value = true
    dragStart.value = {
      x: event.clientX - position.value.x,
      y: event.clientY - position.value.y,
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging.value) return
    position.value = {
      x: event.clientX - dragStart.value.x,
      y: event.clientY - dragStart.value.y,
    }
  }

  function handleMouseUp() {
    isDragging.value = false
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      if (touch1 && touch2) {
        lastTouchDistance.value = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
      }
    } else if (scale.value > 1 && event.touches[0]) {
      isDragging.value = true
      dragStart.value = {
        x: event.touches[0].clientX - position.value.x,
        y: event.touches[0].clientY - position.value.y,
      }
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      if (touch1 && touch2) {
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        const zoomFactor = currentDistance / lastTouchDistance.value
        const newScale = scale.value * zoomFactor
        scale.value = Math.min(Math.max(newScale, 1), 4)
        lastTouchDistance.value = currentDistance
      }
    } else if (isDragging.value && event.touches[0]) {
      position.value = {
        x: event.touches[0].clientX - dragStart.value.x,
        y: event.touches[0].clientY - dragStart.value.y,
      }
    }
  }

  function handleTouchEnd() {
    isDragging.value = false
  }

  function resetZoom() {
    scale.value = 1
    position.value = { x: 0, y: 0 }
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        position.value.x -= 10
        break
      case 'ArrowRight':
        position.value.x += 10
        break
      case 'ArrowUp':
        position.value.y -= 10
        break
      case 'ArrowDown':
        position.value.y += 10
        break
      case '=':
      case '+':
        handleZoomClick()
        break
      case '-':
        if (scale.value > 1) {
          scale.value = Math.max(scale.value * 0.9, 1)
        }
        break
      case 'Escape':
        handleClose()
        break
    }
  }

  watch(
    () => props.isOpen,
    (newValue) => {
      if (!newValue) {
        resetZoom()
      }
    }
  )

  onMounted(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && props.isOpen) {
        handleClose()
      }
    })
  })
</script>

<template>
  <dialog
    v-if="isOpen"
    class="lightbox"
    aria-modal="true"
  >
    <div
      class="lightbox-backdrop"
      role="button"
      tabindex="0"
      aria-label="Close lightbox"
      @click="handleClose"
      @keydown.enter="handleClose"
      @keydown.space.prevent="handleClose"
      @keydown.esc="handleClose"
    >
      <button
        ref="containerRef"
        type="button"
        class="lightbox-container"
        aria-modal="true"
        aria-label="Image viewer. Use arrow keys to pan, + and - to zoom"
        @click.stop
        @wheel.prevent="handleWheel"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @focusout="handleMouseUp"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @keydown="handleKeyDown"
      >
        <div
          v-if="scale <= 1"
          class="image-button"
          role="button"
          tabindex="0"
          aria-label="Zoom image"
          @click.stop="handleZoomClick"
          @keydown.enter="handleZoomClick"
          @keydown.space.prevent="handleZoomClick"
        >
          <NuxtImg
            ref="imageRef"
            :src="imageSrc"
            :alt="imageAlt"
            class="lightbox-image"
            :style="{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              cursor: scale > 1 ? 'grab' : 'zoom-in',
            }"
          />
        </div>
        <div
          v-else
          class="image-container"
        >
          <NuxtImg
            ref="imageRef"
            :src="imageSrc"
            :alt="imageAlt"
            class="lightbox-image"
            :style="{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              cursor: scale > 1 ? 'grab' : 'zoom-in',
            }"
          />
        </div>
      </button>
      <BaseButton
        type="secondary"
        variant="icon"
        icon="mdi:close"
        class="close-button"
        @click.stop="handleClose"
      />
      <BaseButton
        v-if="scale > 1"
        type="secondary"
        variant="icon"
        icon="mdi:image-filter-center-focus"
        class="reset-button"
        @click.stop="resetZoom"
      />
    </div>
  </dialog>
</template>

<style scoped>
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: rgb(0 0 0 / 50%);
    border: none;
    backdrop-filter: blur(5px);
    container-type: inline-size;
    container-name: lightbox;
  }

  .lightbox-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
    border: none;
  }

  .lightbox-image {
    max-width: 90%;
    max-height: 90%;
    pointer-events: none;
    object-fit: contain;
    transition: transform 0.1s ease-out;

    @media screen and (prefers-reduced-motion: reduce) {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      transition: none;
    }
  }

  .close-button,
  .reset-button {
    position: fixed;
    z-index: 1001;
    width: 40px;
    height: 40px;
  }

  .close-button {
    bottom: var(--padding-mobile);
    left: var(--padding-mobile);

    @container lightbox (min-width: 500px) {
      bottom: var(--padding-tablet);
      left: var(--padding-tablet);
    }

    @container lightbox (min-width: 768px) {
      bottom: var(--padding-desktop);
      nav-left: var(--padding-desktop);
    }
  }

  .reset-button {
    right: var(--padding-mobile);
    bottom: calc(var(--padding-mobile));

    @container lightbox (min-width: 500px) {
      right: var(--padding-tablet);
      bottom: calc(var(--padding-tablet));
    }

    @container lightbox (min-width: 768px) {
      right: var(--padding-desktop);
      bottom: calc(var(--padding-desktop));
    }
  }

  .image-button,
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    background: none;
    border: none;
  }

  .image-button {
    cursor: zoom-in;
  }

  .lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    cursor: pointer;
    background: none;
    border: none;
  }
</style>
