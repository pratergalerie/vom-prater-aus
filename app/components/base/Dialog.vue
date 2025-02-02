<script setup lang="ts">
  const props = defineProps<{
    modal: boolean
  }>()

  const open = defineModel<boolean>({ default: false })

  const dialogRef = ref<HTMLDialogElement | null>(null)

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

  // Generate a randomized clip-path
  const randomizeClipPath = () => {
    const points = [
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
    return points
      .map(([x, y]) => {
        const jitter = 2 // Adjust randomness scale
        return `${x! + (Math.random() - 0.5) * jitter}% ${y! + (Math.random() - 0.5) * jitter}%`
      })
      .join(', ')
  }
</script>

<template>
  <dialog ref="dialogRef">
    <div class="dialog-container">
      <div
        class="dialog-content"
        :style="{ clipPath: `polygon(${randomizeClipPath()})` }"
      >
        <button @click="close">Close</button>

        <slot></slot>
      </div>
      <div
        class="shadow"
        :style="{ clipPath: `polygon(${randomizeClipPath()})` }"
      />
    </div>
  </dialog>
</template>

<style scoped>
  dialog {
    z-index: 1000;
    width: 200px;
    height: 100px;
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
    z-index: -1;
    width: 100%;
    height: 100%;
    background: var(--black);
  }
</style>
