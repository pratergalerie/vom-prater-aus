<script lang="ts" setup>
  import ImageUploadArea from '~/components/ImageUploadArea.vue'
  import { useGetDraftStory } from '~/composables/useGetDraftStory'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { useUpdateDraftStory } from '~/composables/useUpdateDraftStory'
  import { useUploadImage } from '~/composables/useUploadImage'
  import { getStrapiImageUrl } from '~/utils/strapi'
  import * as z from 'zod'

  type UserSection = {
    id: string
    type: 'image' | 'image-text' | 'text'
    imageUrl: string | null
    imageId: number | null
    text: string | null
  }

  const validationSchema = computed(() => {
    const sectionFields = userSections.value.reduce(
      (acc, section, index) => {
        switch (section.type) {
          case 'image': {
            acc[`section${index}Image`] = z.instanceof(File).optional()
            acc[`section${index}ImageId`] = z.number().optional().nullable()
            break
          }
          case 'image-text': {
            acc[`section${index}Image`] = z.instanceof(File).optional()
            acc[`section${index}ImageId`] = z.number().optional().nullable()
            acc[`section${index}Text`] = z
              .string({
                message: 'pages.edit.form.sectionText.errors.required',
              })
              .min(1, {
                message: 'pages.edit.form.sectionText.errors.required',
              })
            break
          }
          case 'text': {
            acc[`section${index}Text`] = z
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

          for (let i = 0; i < userSections.value.length; i++) {
            const section = userSections.value[i]
            if (section?.type === 'image' || section?.type === 'image-text') {
              const hasFile = formData[`section${i}Image`] instanceof File
              const hasId = typeof formData[`section${i}ImageId`] === 'number'

              if (!hasFile && !hasId) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'pages.edit.form.sectionImage.errors.required',
                  path: [`section${i}Image`],
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

  const userSections = ref<UserSection[]>(
    sections?.map((section) => {
      return {
        id: crypto.randomUUID(),
        type: section.type,
        imageUrl: section.image ? getStrapiImageUrl(section.image.url) : null,
        imageId: section.image?.id ?? null,
        text: section.text ?? null,
      }
    }) ?? []
  )

  const sectionInitialValues = userSections.value.reduce(
    (acc, section, index) => {
      acc[`section${index}ImageId`] = section.imageId
      acc[`section${index}Text`] = section.text
      return acc
    },
    {} as Record<
      `section${number}ImageId` | `section${number}Text`,
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
    [key: `section${number}Image`]: File | null
    [key: `section${number}ImageId`]: number | null
    [key: `section${number}Text`]: string | null
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

  const handleAddSection = async (type: 'image' | 'image-text' | 'text') => {
    // Prevent user from adding new section when existing section has validation errros
    await validate()
    if (hasValidationErrors.value) {
      return
    }

    userSections.value.push({
      id: crypto.randomUUID(),
      type,
      imageUrl: null,
      imageId: null,
      text: null,
    })
  }

  const handleRemoveSection = () => {
    userSections.value.pop()
  }

  const handleOnSubmit = (action: 'save' | 'submit') =>
    handleSubmit(async ({ authorName, storyTitle: title, storyYear: year }) => {
      const isSubmitStory = action === 'submit'
      const [...sectionImageUploads] = await Promise.all(
        userSections.value.map(async (_, index) => {
          const imageFile = formValues[`section${index}Image`]

          if (imageFile instanceof File) {
            const response = await upload(imageFile)
            return response.type === 'ok' ? (response.data?.id ?? null) : null
          }
          return formValues[`section${index}ImageId`] ?? null
        })
      )

      const sections: Array<{
        type: 'image' | 'image-text' | 'text'
        text: string | null
        image: number | null
      }> = userSections.value.map((section, index) => ({
        type: section.type,
        text: formValues[`section${index}Text`] ?? null,
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
    const { storyTitle: title, authorName, storyYear: year } = formValues

    const response = await update({
      title,
      authorName,
      year,
      sections: userSections.value,
      lifecycleState: 'deleted',
    })

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
          v-if="!userSections[0]"
          class="choose-cover"
        >
          {{ $t('pages.edit.actions.cover.label') }}
          <div class="choose-actions">
            <BaseButton
              icon="mdi:image-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.image')"
              @click="handleAddSection('image')"
            />
            <BaseButton
              icon="mdi:text-box-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.text')"
              @click="handleAddSection('text')"
            />
          </div>
        </div>
        <BaseTextarea
          v-if="userSections[0]?.type === 'text'"
          :required="true"
          name="section0Text"
          :label="$t('pages.edit.form.sectionText.label')"
        />
        <ImageUploadArea
          v-if="userSections[0]?.type === 'image'"
          name="section0Image"
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

      <!-- User Sections -->
      <StoryEditSection
        v-for="(section, index) in userSections.slice(1)"
        :key="section.id"
        :layout="section.type"
        :index="index + 1"
        :image-url="section.imageUrl"
        :last-section="index === userSections.length - 1"
      />

      <div
        v-if="userSections[0]"
        class="section-actions-container"
      >
        <span>{{ $t('pages.edit.actions.section.label') }}</span>
        <div class="section-actions">
          <BaseButton
            icon="mdi:trash-can-outline"
            variant="primary"
            :label="
              userSections.length === 1
                ? $t('pages.edit.actions.section.removeCover')
                : $t('pages.edit.actions.section.remove')
            "
            @click="handleRemoveSection"
          />
          <BaseButton
            icon="mdi:text-box-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.text')"
            @click="handleAddSection('text')"
          />
          <BaseButton
            icon="mdi:image-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image')"
            @click="handleAddSection('image')"
          />
          <BaseButton
            icon="mdi:note-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image-text')"
            @click="handleAddSection('image-text')"
          />
        </div>
      </div>

      <StoryEditActions :style="{ position: 'sticky' }">
        <template
          v-if="hasValidationErrors"
          #formStatus
        >
          <p class="error">
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
                  class="button"
                  :label="$t('pages.edit.actions.deleteStory.modal.cancel')"
                  @click="handleToggleDialog('delete')"
                />
                <BaseButton
                  variant="secondary"
                  class="button"
                  :label="$t('pages.edit.actions.deleteStory.modal.confirm')"
                  @click="handleDeleteStory"
                />
              </div>
            </BaseDialog>

            <BaseButton
              :disabled="isSubmitting"
              variant="primary"
              class="button"
              icon="mdi:trash-can-outline"
              @click="handleToggleDialog('delete')"
            />
          </div>

          <!-- Save Story -->
          <BaseButton
            :disabled="isSubmitting"
            variant="primary"
            class="button"
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
                  class="button"
                  :label="$t('pages.edit.actions.submitStory.modal.cancel')"
                  @click="handleToggleDialog('submit')"
                />
                <BaseButton
                  variant="secondary"
                  class="button"
                  :label="$t('pages.edit.actions.submitStory.modal.confirm')"
                  @click="handleSubmitStory"
                />
              </div>
            </BaseDialog>
            <BaseButton
              :disabled="isSubmitting"
              variant="secondary"
              class="button"
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
