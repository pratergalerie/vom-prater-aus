<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean
    imageSrc: string
    imageAlt: string
  }>()

  const emit = defineEmits(['close'])

  const containerRef = ref<HTMLDivElement | null>(null)
  const originalBodyStyle = ref<string>('')

  function handleClose() {
    emit('close')
  }

  function handleContainerClick(event: MouseEvent | KeyboardEvent) {
    // Only close if clicking directly on the container (backdrop), not on the image
    if (event.target === containerRef.value) {
      handleClose()
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
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && props.isOpen) {
        handleClose()
      }
    })
  })

  onUnmounted(() => {
    // Ensure scroll is unlocked when component is unmounted
    unlockScroll()
  })

  watch(
    () => props.isOpen,
    (newValue) => {
      if (newValue) {
        lockScroll()
      } else {
        unlockScroll()
      }
    }
  )
</script>

<template>
  <Teleport to="body">
    <dialog
      v-if="isOpen"
      class="lightbox"
      aria-modal="true"
    >
      <div
        ref="containerRef"
        class="lightbox-backdrop"
        role="button"
        tabindex="0"
        @click="handleContainerClick"
        @keydown.enter="handleContainerClick"
        @keydown.space.prevent="handleContainerClick"
      >
        <div class="lightbox-container">
          <NuxtImg
            :src="imageSrc"
            :alt="imageAlt"
            class="lightbox-image"
          />
        </div>
        <BaseButton
          variant="primary"
          layout="icon"
          icon="mdi:close"
          class="close-button"
          @click.stop="handleClose"
        />
      </div>
    </dialog>
  </Teleport>
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .lightbox-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }

  .close-button {
    position: fixed;
    top: var(--space-xs);
    right: var(--space-xs);
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
