<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      description: string
      required?: boolean
      imageUrl?: string | null
    }>(),
    {
      required: false,
      imageUrl: '',
    }
  )

  const fileFieldName = props.name
  const fileIdFieldName = `${props.name}Id`

  const {
    value,
    handleBlur,
    resetField: resetFileField,
    errorMessage,
  } = useField(() => fileFieldName)

  const { value: imageId, setValue: setImageIdField } = useField(
    () => fileIdFieldName
  )

  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragOver = ref(false)
  const isFileUploaded = computed(() => value.value)
  const imageUrl = ref<string | null>(props.imageUrl)

  const triggerFileInput = () => {
    resetFileField()
    fileInput.value?.click()
  }

  const fileUpload = (file: File) => {
    value.value = file
    imageUrl.value = URL.createObjectURL(file)
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
    resetFileField()
    setImageIdField(null)
    imageUrl.value = null
  }

  const handleFileChange = (event: Event) => {
    resetFileField()
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
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="handleDragLeave"
  >
    <div>
      <span>{{ label }}{{ required ? '*' : '' }}</span>
      <span
        v-if="errorMessage"
        class="error error-message"
      >
        {{ ' ' }}
        {{ $t(errorMessage) }}
      </span>
    </div>
    <div
      class="upload-area"
      :style="{
        backgroundColor: isDragOver ? 'var(--color-success-light)' : undefined,
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      }"
    >
      <!-- <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
      /> -->
      <input
        v-bind="$attrs"
        :id="fileFieldName"
        ref="fileInput"
        :name="fileFieldName"
        type="file"
        class="visually-hidden"
        accept="image/png, image/jpeg"
        @change.stop="handleFileChange"
        @blur="handleBlur"
      />
      <input
        :id="fileIdFieldName"
        v-model="imageId"
        :name="fileIdFieldName"
        type="number"
        class="visually-hidden"
      />

      <div class="info-wrapper">
        <div class="info">
          <p v-if="!imageUrl && !isFileUploaded">
            {{ description }}
          </p>

          <BaseButton
            variant="primary"
            layout="label"
            class="button"
            :label="
              imageUrl || isFileUploaded
                ? $t('pages.edit.actions.removeImage')
                : $t('pages.edit.actions.uploadImage')
            "
            @click.stop="
              imageUrl || isFileUploaded
                ? handleFileRemove()
                : triggerFileInput()
            "
          />
        </div>
      </div>
    </div>
  </label>
</template>

<style scoped>
  label {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    width: 100%;
    height: 100%;
    font-weight: 600;
  }

  .upload-area {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    width: 100%;
    height: 100%;
    min-height: 500px;
    background-color: var(--color-white);
    background-position: center;
    background-size: cover;

    & .info-wrapper {
      z-index: 3;
      display: flex;
      flex-flow: wrap;
      flex-direction: column;
      place-content: center;

      & .info {
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        padding: var(--space-l);
        text-align: center;
        background-color: var(--color-white);
        clip-path: polygon(
          0% 10%,
          12.22% 5.3%,
          21.5% 10.87%,
          53.76% 8.25%,
          98.35% 0%,
          98.64% 76.25%,
          97.26% 89.26%,
          88.2% 82.2%,
          83.73% 91.73%,
          70.85% 94.85%,
          63.69% 88.69%,
          53.76% 93.76%,
          26.98% 92.98%,
          1.26% 89.26%,
          0% 73.2%,
          0% 100%
        );

        & p {
          font-weight: 600;
        }
      }
    }
  }

  .error-message {
    font-weight: 400;
  }
</style>
