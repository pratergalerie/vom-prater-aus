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

  const { values, handleSubmit, errors, isSubmitting, validate } = useForm<{
    submitStory: boolean
    storyTitle: string | null
    authorName: string | null
    storyYear: number | null
    [key: `section${number}Image`]: File | null
    [key: `section${number}ImageId`]: number | null
    [key: `section${number}Text`]: string | null
  }>({
    validationSchema,
    initialValues: {
      submitStory: false,
      storyTitle,
      authorName,
      storyYear,
      ...sectionInitialValues,
    },
  })
  const hasValidationErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

  const addSection = async (type: 'image' | 'image-text' | 'text') => {
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

  const removeSection = () => {
    userSections.value.pop()
  }

  const onSubmit = handleSubmit(
    async ({ submitStory, authorName, storyTitle: title, storyYear: year }) => {
      const isSubmitting = submitStory

      const [...sectionImageUploads] = await Promise.all(
        userSections.value.map(async (section, index) => {
          const imageFile = values[`section${index}Image`]

          if (imageFile instanceof File) {
            const response = await upload(imageFile)
            return response.type === 'ok' ? (response.data?.id ?? null) : null
          }
          return values[`section${index}ImageId`] ?? null
        })
      )

      const sections: Array<{
        type: 'image' | 'image-text' | 'text'
        text: string | null
        image: number | null
      }> = userSections.value.map((section, index) => ({
        type: section.type,
        text: values[`section${index}Text`] ?? null,
        image: sectionImageUploads[index] ?? null,
      }))

      const response = await update({
        title,
        authorName,
        year,
        sections,
        ...(isSubmitting && { lifecycleState: 'submitted' }),
      })

      if (isSubmitting && response.type === 'ok') {
        await navigateTo({ path: `/draft-stories/submitted` })
      }
    }
  )
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

    <form
      v-else
      @submit="onSubmit"
    >
      <div class="hero">
        <div
          v-if="!userSections[0]"
          class="choose-cover"
        >
          {{ $t('pages.edit.actions.cover.label') }}
          <div class="choose-actions">
            <BaseButton
              layout="label-icon"
              icon="mdi:image-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.image')"
              @click="addSection('image')"
            />
            <BaseButton
              layout="label-icon"
              icon="mdi:text-box-plus-outline"
              variant="primary"
              :label="$t('pages.edit.actions.cover.add.text')"
              @click="addSection('text')"
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
            layout="label-icon"
            icon="mdi:trash-can-outline"
            variant="primary"
            :label="
              userSections.length === 1
                ? $t('pages.edit.actions.section.removeCover')
                : $t('pages.edit.actions.section.remove')
            "
            @click="removeSection"
          />
          <BaseButton
            layout="label-icon"
            icon="mdi:text-box-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.text')"
            @click="addSection('text')"
          />
          <BaseButton
            layout="label-icon"
            icon="mdi:image-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image')"
            @click="addSection('image')"
          />
          <BaseButton
            layout="label-icon"
            icon="mdi:note-plus-outline"
            variant="primary"
            :label="$t('pages.edit.actions.section.add.image-text')"
            @click="addSection('image-text')"
          />
        </div>
      </div>

      <StoryEditActions :style="{ position: 'sticky' }">
        <template #actions>
          <div class="submit">
            <div class="button-checkbox">
              <BaseCheckbox name="submitStory">
                <template #label>
                  <p>{{ $t('pages.edit.actions.submitCheckbox') }}</p>
                </template>
              </BaseCheckbox>
              <BaseButton
                type="submit"
                :disabled="isSubmitting"
                :variant="isSubmitStoryChecked ? 'secondary' : 'primary'"
                layout="label"
                class="button"
                :label="
                  isSubmitStoryChecked
                    ? $t('pages.edit.actions.submitStory')
                    : $t('pages.edit.actions.saveStory')
                "
              />
            </div>
            <p
              v-if="hasValidationErrors"
              class="error"
            >
              {{ $t('pages.edit.form.error') }}
            </p>
          </div>
        </template>
      </StoryEditActions>
    </form>
  </div>
</template>

<style scoped>
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

  .submit {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    align-items: flex-end;
  }

  .button-checkbox {
    display: flex;
    flex-wrap: wrap-reverse;
    gap: var(--space-s);
    align-items: center;
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
</style>
