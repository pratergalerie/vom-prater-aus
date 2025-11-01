<script lang="ts" setup>
  import ImageUploadArea from '~/components/ImageUploadArea.vue'
  import { useGetDraftStory } from '~/composables/useGetDraftStory'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { useUpdateDraftStory } from '~/composables/useUpdateDraftStory'
  import { useDeleteDraftStory } from '~/composables/useDeleteDraftStory'
  import { useUploadImage } from '~/composables/useUploadImage'
  import { getStrapiImageUrl } from '~/utils/strapi'
  import * as z from 'zod'

  type UserSection = {
    id: string
    type: 'image' | 'image-text' | 'text' | null
    imageUrl: string | null
    imageId: number | null
    text: string | null
  }

  const validationSchema = computed(() => {
    const sectionFields = userSections.value.reduce(
      (acc, section) => {
        switch (section.type) {
          case 'image': {
            acc[`section${section.id}Image`] = z.instanceof(File).optional()
            acc[`section${section.id}ImageId`] = z
              .number()
              .optional()
              .nullable()
            break
          }
          case 'image-text': {
            acc[`section${section.id}Image`] = z.instanceof(File).optional()
            acc[`section${section.id}ImageId`] = z
              .number()
              .optional()
              .nullable()
            acc[`section${section.id}Text`] = z
              .string({
                message: 'pages.edit.form.sectionText.errors.required',
              })
              .min(1, {
                message: 'pages.edit.form.sectionText.errors.required',
              })
            break
          }
          case 'text': {
            acc[`section${section.id}Text`] = z
              .string({
                message: 'pages.edit.form.sectionText.errors.required',
              })
              .min(1, {
                message: 'pages.edit.form.sectionText.errors.required',
              })
            break
          }
        }
        return acc
      },
      {} as Record<string, z.ZodTypeAny>
    )

    return toTypedSchema(
      z
        .object({
          authorName: z
            .string({
              message: 'pages.create.form.inputs.authorName.errors.required',
            })
            .nonempty({
              message: 'pages.create.form.inputs.authorName.errors.required',
            }),
          storyTitle: z
            .string({
              message: 'pages.create.form.inputs.storyTitle.errors.required',
            })
            .nonempty({
              message: 'pages.create.form.inputs.storyTitle.errors.required',
            }),
          storyYear: z.coerce
            .number({
              message: 'pages.create.form.inputs.storyYear.errors.required',
            })
            .int({
              message: 'pages.create.form.inputs.storyYear.errors.invalid',
            })
            .min(1831, {
              message: 'pages.create.form.inputs.storyYear.errors.min',
            })
            .max(2017, {
              message: 'pages.create.form.inputs.storyYear.errors.max',
            }),
          ...sectionFields,
        })
        // Check each image section has at least one image source
        .superRefine((data, ctx) => {
          const formData = data as typeof data & Record<string, unknown>

          // Check if cover section is filled with valid content
          const coverSection = userSections.value[0]

          if (coverSection?.type === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'pages.edit.actions.cover.errors.required',
              path: ['cover'],
            })
          } else if (coverSection?.type === 'text') {
            // Check if cover text is filled
            const coverText = formData[`section${coverSection.id}Text`]
            if (
              !coverText ||
              (typeof coverText === 'string' && coverText.trim().length === 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'pages.edit.actions.cover.errors.required',
                path: ['cover'],
              })
            }
          } else if (coverSection?.type === 'image') {
            // Check if cover image is filled
            const hasFile =
              formData[`section${coverSection.id}Image`] instanceof File
            const hasId =
              typeof formData[`section${coverSection.id}ImageId`] === 'number'
            if (!hasFile && !hasId) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'pages.edit.actions.cover.errors.required',
                path: ['cover'],
              })
            }
          }

          for (const section of userSections.value) {
            if (section?.type === 'image' || section?.type === 'image-text') {
              const hasFile =
                formData[`section${section.id}Image`] instanceof File
              const hasId =
                typeof formData[`section${section.id}ImageId`] === 'number'

              if (!hasFile && !hasId) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'pages.edit.form.sectionImage.errors.required',
                  path: [`section${section.id}Image`],
                })
              }
            }
          }
        })
    )
  })

  const route = useRoute()
  const uuid = route.params.uuid as string

  const { update } = useUpdateDraftStory(uuid)
  const { delete: deleteStory } = useDeleteDraftStory(uuid)
  const { upload } = useUploadImage()

  const { data: storyData, status, error } = await useGetDraftStory(uuid)
  const {
    title: storyTitle,
    year: storyYear,
    authorName,
    sections,
  } = storyData.value ?? {}

  const showDeleteDialog = ref(false)
  const showSubmitDialog = ref(false)

  // Counter for generating unique section IDs
  let nextSectionId = 0

  const userSections = ref<UserSection[]>(
    sections?.map((section, index) => {
      return {
        id: `section-${index}`,
        type: section.type,
        imageUrl: section.image ? getStrapiImageUrl(section.image.url) : null,
        imageId: section.image?.id ?? null,
        text: section.text ?? null,
      }
    }) ?? []
  )

  // Always ensure there's a first section (cover) if there isn't one
  if (userSections.value.length === 0) {
    userSections.value.push({
      id: 'section-0',
      type: null,
      imageUrl: null,
      imageId: null,
      text: null,
    })
  }

  // Set counter to the next available ID
  nextSectionId = userSections.value.length

  const userSectionsWithoutCover = computed(() =>
    userSections.value.slice(1).filter((section) => section.type !== null)
  )

  const sectionInitialValues = userSections.value.reduce(
    (acc, section) => {
      acc[`section${section.id}ImageId`] = section.imageId
      acc[`section${section.id}Text`] = section.text
      return acc
    },
    {} as Record<
      `section${string}ImageId` | `section${string}Text`,
      number | string | null
    >
  )

  const {
    values: formValues,
    handleSubmit,
    errors,
    isSubmitting,
    validate,
  } = useForm<{
    storyTitle: string | null
    authorName: string | null
    storyYear: number | null
    cover?: string | null
    [key: `section${string}Image`]: File | null
    [key: `section${string}ImageId`]: number | null
    [key: `section${string}Text`]: string | null
  }>({
    validationSchema,
    initialValues: {
      storyTitle,
      authorName,
      storyYear,
      ...sectionInitialValues,
    },
  })
  const hasValidationErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  const handleToggleDialog = (dialogToToggle: 'delete' | 'submit') => {
    switch (dialogToToggle) {
      case 'delete':
        showDeleteDialog.value = !showDeleteDialog.value
        break
      case 'submit':
        showSubmitDialog.value = !showSubmitDialog.value
        break
    }
  }

  const handleAddSection = async (
    type: 'image' | 'image-text' | 'text',
    position: number
  ) => {
    // Allow adding cover section (position 0) even when empty
    // But prevent adding other sections when cover is not filled or when there are validation errors
    if (position > 0) {
      await validate()
      if (hasValidationErrors.value) {
        return
      }
    }

    // Insert new section
    userSections.value.splice(position, 0, {
      id: `section-${nextSectionId++}`,
      type,
      imageUrl: null,
      imageId: null,
      text: null,
    })
  }

  const handleResetCover = () => {
    if (userSections.value[0]) {
      userSections.value[0] = {
        id: 'section-0',
        type: null,
        imageUrl: null,
        imageId: null,
        text: null,
      }
    }
  }

  const handleRemoveSection = (sectionId: string) => {
    // Remove section by ID
    const index = userSections.value.findIndex(
      (section) => section.id === sectionId
    )
    if (index !== -1) {
      userSections.value.splice(index, 1)
    }
  }

  const handleOnSubmit = (action: 'save' | 'submit') =>
    handleSubmit(async ({ authorName, storyTitle: title, storyYear: year }) => {
      const isSubmitStory = action === 'submit'
      const [...sectionImageUploads] = await Promise.all(
        userSections.value.map(async (section) => {
          const imageFile = formValues[`section${section.id}Image`]

          if (imageFile instanceof File) {
            const response = await upload(imageFile)
            return response.type === 'ok' ? (response.data?.id ?? null) : null
          }
          return formValues[`section${section.id}ImageId`] ?? null
        })
      )

      const sections: Array<{
        type: 'image' | 'image-text' | 'text' | null
        text: string | null
        image: number | null
      }> = userSections.value.map((section, index) => ({
        type: section.type,
        text: formValues[`section${section.id}Text`] ?? null,
        image: sectionImageUploads[index] ?? null,
      }))

      const response = await update({
        title,
        authorName,
        year,
        sections,
        ...(isSubmitStory && { lifecycleState: 'submitted' }),
      })

      if (isSubmitStory && response.type === 'ok') {
        await navigateTo({ path: `/draft-stories/submitted` })
      }
    })

  const handleSaveStory = handleOnSubmit('save')
  const handleSubmitStory = handleOnSubmit('submit')

  const handleDeleteStory = async () => {
    const response = await deleteStory()

    if (response.type === 'ok') {
      await navigateTo({ path: `/draft-stories/deleted` })
    }
  }
</script>
<template>
  <div>
    <p
      v-if="status === 'pending'"
      class="status"
    >
      {{ $t('pages.stories.story.loading') }}
    </p>

    <p
      v-else-if="!storyData || error"
      class="status error"
    >
      {{ $t('pages.stories.story.error') }}
    </p>

    <form v-else>
      <div class="hero">
        <div
          v-if="userSections[0]?.type === null"
          class="choose-cover"
        >
          {{ $t('pages.edit.actions.cover.label') }}
          <div class="choose-actions">
            <BaseButton
              icon="mdi:image-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.image')"
              @click="handleAddSection('image', 0)"
            />
            <BaseButton
              icon="mdi:text-box-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.text')"
              @click="handleAddSection('text', 0)"
            />
          </div>
        </div>
        <BaseTextarea
          v-if="userSections[0]?.type === 'text'"
          :required="true"
          :name="`section${userSections[0].id}Text`"
          :label="$t('pages.edit.form.sectionText.label')"
        />
        <ImageUploadArea
          v-if="userSections[0]?.type === 'image'"
          :name="`section${userSections[0].id}Image`"
          :required="true"
          :image-url="
            storyData.sections[0]?.image &&
            getStrapiImageUrl(storyData.sections[0].image.url)
          "
          :label="$t('pages.edit.form.sectionImage.label')"
          :description="$t('pages.edit.form.sectionImage.description')"
        />
      </div>

      <StoryTitleLayout layout="edit">
        <template #title>
          <BaseInput
            name="storyTitle"
            type="text"
            :required="true"
            :label="$t('pages.create.form.inputs.storyTitle.label')"
          />
        </template>
        <template #author>
          <BaseInput
            name="authorName"
            type="text"
            :required="true"
            :label="$t('pages.create.form.inputs.authorName.label')"
          />
        </template>
        <template #year>
          <BaseInput
            name="storyYear"
            type="number"
            :required="true"
            :label="$t('pages.create.form.inputs.storyYear.label')"
          />
        </template>
      </StoryTitleLayout>

      <!-- Cover Edits -->
      <div class="section-actions-container">
        <span>{{ $t('pages.edit.actions.section.label') }}</span>
        <div class="section-actions">
          <BaseButton
            icon="mdi:trash-can-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.removeCover')"
            @click="handleResetCover"
          />
          <BaseButton
            icon="mdi:text-box-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.text')"
            @click="handleAddSection('text', 1)"
          />
          <BaseButton
            icon="mdi:image-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image')"
            @click="handleAddSection('image', 1)"
          />
          <BaseButton
            icon="mdi:note-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image-text')"
            @click="handleAddSection('image-text', 1)"
          />
        </div>
      </div>

      <!-- User Sections -->
      <StoryEditSection
        v-for="(section, index) in userSectionsWithoutCover"
        :key="section.id"
        :layout="section.type"
        :section-id="section.id"
        :image-url="section.imageUrl"
      >
        <template #actions>
          <div class="section-actions-container">
            <span>{{ $t('pages.edit.actions.section.label') }}</span>
            <div class="section-actions">
              <BaseButton
                icon="mdi:trash-can-outline"
                variant="primary"
                :label="$t('pages.edit.actions.section.remove')"
                @click="handleRemoveSection(section.id)"
              />
              <BaseButton
                icon="mdi:text-box-plus-outline"
                variant="primary"
                :label="$t('pages.edit.actions.section.add.text')"
                @click="handleAddSection('text', index + 2)"
              />
              <BaseButton
                icon="mdi:image-plus-outline"
                variant="primary"
                :label="$t('pages.edit.actions.section.add.image')"
                @click="handleAddSection('image', index + 2)"
              />
              <BaseButton
                icon="mdi:note-plus-outline"
                variant="primary"
                :label="$t('pages.edit.actions.section.add.image-text')"
                @click="handleAddSection('image-text', index + 2)"
              />
            </div>
          </div>
        </template>
      </StoryEditSection>

      <StoryEditActions :style="{ position: 'sticky' }">
        <template #formStatus>
          <p
            v-if="hasValidationErrors"
            class="error"
          >
            {{ errors['cover'] && $t(errors['cover']) }}
            {{ $t('pages.edit.form.error') }}
          </p>
        </template>

        <template #actions>
          <!-- Delete Story -->
          <div class="button-dialog-wrapper">
            <BaseDialog
              v-model:is-open="showDeleteDialog"
              :modal="true"
              width="40ch"
            >
              <p>
                {{ $t('pages.edit.actions.deleteStory.modal.description') }}
              </p>
              <div class="dialog-buttons">
                <BaseButton
                  variant="primary"
                  :label="$t('pages.edit.actions.deleteStory.modal.cancel')"
                  @click="handleToggleDialog('delete')"
                />
                <BaseButton
                  variant="secondary"
                  :label="$t('pages.edit.actions.deleteStory.modal.confirm')"
                  @click="handleDeleteStory"
                />
              </div>
            </BaseDialog>

            <BaseButton
              :disabled="isSubmitting"
              variant="primary"
              icon="mdi:trash-can-outline"
              @click="handleToggleDialog('delete')"
            />
          </div>

          <!-- Save Story -->
          <BaseButton
            :disabled="isSubmitting"
            variant="primary"
            :label="$t('pages.edit.actions.saveStory')"
            @click="handleSaveStory"
          />

          <!-- Submit Story -->
          <div class="button-dialog-wrapper">
            <BaseDialog
              v-model:is-open="showSubmitDialog"
              :modal="true"
              width="40ch"
            >
              <p>
                {{ $t('pages.edit.actions.submitStory.modal.description') }}
              </p>
              <div class="dialog-buttons">
                <BaseButton
                  variant="primary"
                  :label="$t('pages.edit.actions.submitStory.modal.cancel')"
                  @click="handleToggleDialog('submit')"
                />
                <BaseButton
                  variant="secondary"
                  :label="$t('pages.edit.actions.submitStory.modal.confirm')"
                  @click="handleSubmitStory"
                />
              </div>
            </BaseDialog>
            <BaseButton
              :disabled="isSubmitting"
              variant="secondary"
              :label="$t('pages.edit.actions.submitStory.label')"
              @click="
                async () => {
                  // Doesn't show modal when form has still errors
                  await validate()
                  if (hasValidationErrors) {
                    return
                  }
                  handleToggleDialog('submit')
                }
              "
            />
          </div>
        </template>
      </StoryEditActions>
    </form>
  </div>
</template>

<style scoped>
  button {
    /* stylelint-disable-next-line custom-property-pattern */
    font-size: var(--step--1);
  }

  /* stylelint-disable-next-line plugins/no-unused-selectors */
  .hero {
    height: 600px;
  }

  .choose-cover {
    box-sizing: border-box;
    display: grid;
    gap: var(--space-xs);
    place-content: center;
    width: 100%;
    height: 100%;
    padding: var(--space-l);
    font-weight: 600;
    text-align: center;
    background-color: var(--color-white);

    & .choose-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      justify-content: center;
    }
  }

  /* stylelint-disable-next-line plugins/no-unused-selectors */
  .title-container {
    margin-block-end: var(--space-2xl);
  }

  .status {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    height: 100%;
    font-size: var(--step-1);
    font-weight: 600;
  }

  .button-dialog-wrapper {
    position: relative;
  }

  .section-actions-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    align-items: center;
    max-width: 70ch;
    margin: 0 auto;
    margin-block-end: var(--space-2xl);

    & > span {
      font-weight: 600;
      text-align: center;
    }
  }

  .section-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    justify-content: center;
  }

  .dialog-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-2xs);
  }
</style>
