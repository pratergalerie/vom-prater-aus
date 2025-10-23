<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      required?: boolean
    }>(),
    { required: false }
  )

  const { value, errorMessage, handleBlur, resetField } = useField(
    () => props.name
  )

  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragOver = ref(false)
  const isFileUploaded = computed(() => value.value)

  const triggerFileInput = () => {
    resetField()
    fileInput.value?.click()
  }

  const fileUpload = (file: File) => {
    value.value = file
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragOver.value = true
  }

  const handleDragLeave = () => {
    isDragOver.value = false
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragOver.value = false

    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0]

      if (file) {
        fileUpload(file)
      }
    }
  }

  const handleFileRemove = () => {
    resetField()
  }

  const handleFileChange = (event: Event) => {
    resetField()
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      const file = input.files[0]

      if (file) {
        fileUpload(file)
      }
    }
  }
</script>

<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
  <label
    :for="name"
    :style="{
      backgroundColor: isDragOver ? 'var(--color-success-light)' : undefined,
    }"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="handleDragLeave"
  >
    <input
      v-bind="$attrs"
      :id="name"
      ref="fileInput"
      :name="name"
      type="file"
      class="visually-hidden"
      accept="image/png, image/jpeg"
      @change.stop="handleFileChange"
      @blur="handleBlur"
    />

    <p>{{ label }}</p>
    {{ (value as File | undefined)?.name }}

    <BaseButton
      variant="primary"
      layout="label-icon"
      class="button"
      :label="isFileUploaded ? 'Remove Image' : 'Upload Image'"
      @click.stop="isFileUploaded ? handleFileRemove() : triggerFileInput()"
    />
  </label>
</template>

<style scoped>
  label {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    align-items: center;
    justify-content: center;
    padding: var(--space-l);
    font-weight: 600;
    text-align: center;
    background-color: var(--color-white);
  }
</style>
