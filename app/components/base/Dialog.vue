<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const props = defineProps<{
    modal: boolean
    speechBubblePosition?: 'bottom-left' | 'bottom-center' | 'bottom-right'
  }>()

  const open = defineModel<boolean>({ default: false })

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const shapeClipPath = ref('')

  function close() {
    open.value = false
  }

  watch(open, (isOpen) => {
    if (isOpen) {
      if (props.modal) {
        dialogRef.value?.showModal()
      } else {
        dialogRef.value?.show()
      }
    } else {
      dialogRef.value?.close()
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

  onClickOutside(dialogRef, () => {
    open.value = false
  })
</script>

<template>
  <dialog ref="dialogRef">
    <div class="dialog-container">
      <div
        class="dialog-content"
        :style="{ clipPath: shapeClipPath }"
      >
        <button
          class="close-button"
          @click="close"
        >
          <Icon name="mdi:close" />
        </button>

        <slot></slot>
      </div>

      <div
        class="shadow"
        :style="{ clipPath: shapeClipPath }"
      />

      <div
        v-if="props.speechBubblePosition"
        class="speech-bubble"
        :class="props.speechBubblePosition"
      />
    </div>
  </dialog>
</template>

<style scoped>
  dialog {
    z-index: 1000;
    width: fit-content;
    height: fit-content;
    padding: 0;
    background: transparent;
    border: none;
  }

  .dialog-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .dialog-content {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: var(--padding);
    background: var(--white);
  }

  .shadow {
    position: absolute;
    top: 5px;
    left: -5px;
    z-index: -2;
    width: 100%;
    height: 100%;
    background: var(--black);
  }

  .close-button {
    position: absolute;
    top: calc(var(--padding) * 1.2);
    right: var(--padding);
    width: 1.5rem;
    height: 1.5rem;
    color: var(--black);
    cursor: pointer;
    background: none;
    border: none;
  }

  /* Speech bubble triangle */
  .speech-bubble {
    position: absolute;
    bottom: -10px;
    z-index: -1;
    width: 0;
    height: 0;
    border-color: var(--white) transparent transparent transparent;
    border-style: solid;
    border-width: 12px 10px 0;
  }

  /* Position variants */
  .speech-bubble.bottom-left {
    left: 20px;
    filter: drop-shadow(-3px -2px 0 var(--black));
    transform: translateY(-5px) rotate(-90deg);
    scale: 2;
  }

  .speech-bubble.bottom-center {
    left: 50%;
    filter: drop-shadow(-1px 3px 0 var(--black));
    transform: translateX(-26%) skew(-0.02turn, 5deg);
    scale: 2;
  }

  .speech-bubble.bottom-right {
    right: 30px;
    filter: drop-shadow(3px -1px 0 var(--black));
    transform: translateY(-7px) rotate(90deg);
    scale: 3;
  }
</style>
