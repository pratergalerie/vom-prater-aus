<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const open = defineModel<boolean>({ default: false })

  const modalRef = ref<HTMLDialogElement | null>(null)
  const shapeClipPath = ref('')

  function close() {
    open.value = false
  }

  watch(open, (isOpen) => {
    if (isOpen) {
      modalRef.value?.showModal()
    } else {
      modalRef.value?.close()
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

  onClickOutside(modalRef, () => {
    open.value = false
  })
</script>

<template>
  <Teleport to="#teleports">
    <dialog ref="modalRef">
      <div class="modal-container">
        <div
          class="modal-content"
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

          <slot />
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
    background: transparent;
    border: none;

    &::backdrop {
      background: rgb(0 0 0 / 50%);
    }
  }

  .modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(70vw, 500px); /* Default width */
    height: fit-content; /* Change from fixed height to fit-content */
    min-height: 200px; /* Add a minimum height */
    margin: auto; /* Center the modal */
    background: transparent;
    filter: drop-shadow(-5px 5px 0 rgb(0 0 0 / 100%));
    transform: translate(-50%, -50%);
  }

  .modal-content {
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
