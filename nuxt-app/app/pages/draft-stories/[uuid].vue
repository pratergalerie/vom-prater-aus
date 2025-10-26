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
        if (section.type === 'image' || section.type === 'image-text') {
          acc[`section${index}Image`] = z.instanceof(File).optional()
          acc[`section${index}ImageId`] = z.number().optional().nullable()
        }
        if (section.type === 'text' || section.type === 'image-text') {
          acc[`section${index}Text`] = z
            .string()
            .nonempty({ message: 'Required field' })
        }
        return acc
      },
      {} as Record<string, z.ZodTypeAny>
    )

    return toTypedSchema(
      z
        .object({
          coverImage: z.instanceof(File).optional(),
          coverImageId: z.number().optional().nullable(),
          bodyText: z.string().optional().nullable(),
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
        .refine(
          (data) => {
            return (
              data.coverImage ||
              Boolean(data?.bodyText?.length) ||
              data.coverImageId
            )
          },
          {
            message: 'pages.edit.form.errors.atLeast',
            path: [''], // applies error to the root level
          }
        )
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

  const { text: bodyText, image: coverImage } = sections?.[0] ?? {}

  const userSections = ref<UserSection[]>(
    sections?.slice(1).map((section) => {
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

  const { values, handleSubmit, errors, isSubmitting } = useForm<{
    bodyText: string | null
    submitStory: boolean
    coverImage: File | null
    coverImageId: number | null
    storyTitle: string | null
    authorName: string | null
    storyYear: number | null
    [key: `section${number}Image`]: File | null
    [key: `section${number}ImageId`]: number | null
    [key: `section${number}Text`]: string | null
  }>({
    validationSchema,
    initialValues: {
      bodyText: bodyText ?? '',
      submitStory: false,
      coverImageId: coverImage?.id,
      storyTitle,
      authorName,
      storyYear,
      ...sectionInitialValues,
    },
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

  const addSection = (type: 'image' | 'image-text' | 'text') => {
    userSections.value.push({
      id: crypto.randomUUID(),
      type,
      imageUrl: null,
      imageId: null,
      text: null,
    })
  }

  const removeSection = (id: string) => {
    const index = userSections.value.findIndex((s) => s.id === id)
    if (index === -1) return

    userSections.value.splice(index, 1)

    // Note: vee-validate will handle cleanup of field values
  }

  const onSubmit = handleSubmit(
    async ({
      coverImage: coverImageField,
      coverImageId: coverImageIdField,
      bodyText,
      submitStory,
      authorName,
      storyTitle: title,
      storyYear: year,
    }) => {
      const isSubmitting = submitStory

      const [coverImageUploadResult, ...sectionImageUploads] =
        await Promise.all([
          (async () => {
            if (coverImageField) {
              const response = await upload(coverImageField)
              return response.type === 'ok' ? (response.data?.id ?? null) : null
            }
            return coverImageIdField
          })(),

          ...userSections.value.map(async (section, index) => {
            const imageFile = values[`section${index}Image`]

            if (imageFile instanceof File) {
              const response = await upload(imageFile)
              return response.type === 'ok' ? (response.data?.id ?? null) : null
            }
            return values[`section${index}ImageId`] ?? null
          }),
        ])

      const coverImageId = coverImageUploadResult

      const sections: Array<{
        type: 'image' | 'image-text' | 'text'
        text: string | null
        image: number | null
      }> = [
        // First section (cover image + body text)
        {
          type: 'image-text',
          text: bodyText,
          image: coverImageId,
        },
        // User-added sections
        ...userSections.value.map((section, index) => ({
          type: section.type,
          text: values[`section${index}Text`] ?? null,
          image: sectionImageUploads[index] ?? null,
        })),
      ]

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
      <StoryHeroLayout>
        <template #image>
          <ImageUploadArea
            name="coverImage"
            :image-url="
              storyData.sections[0]?.image &&
              getStrapiImageUrl(storyData.sections[0]?.image?.url)
            "
            :label="$t('pages.edit.form.coverImage.label')"
          />
        </template>

        <template #titleBlock>
          <StoryTitleLayout>
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
        </template>
      </StoryHeroLayout>

      <section>
        <BaseTextarea
          name="bodyText"
          :label="`1. ${$t('pages.edit.form.bodyText.label')}`"
        />
      </section>

      <!-- User Sections -->
      <StoryEditSection
        v-for="(section, index) in userSections"
        :key="section.id"
        :type="section.type"
        :index="index"
        :image-url="section.imageUrl"
        :last-section="index === userSections.length - 1"
      />

      <StoryEditActions :style="{ position: 'sticky' }">
        <template #actions>
          <div class="section-buttons">
            <BaseButton
              layout="label"
              type="button"
              variant="secondary"
              :label="$t('pages.edit.actions.section.add.text')"
              @click="addSection('text')"
            />
            <BaseButton
              layout="label"
              type="button"
              variant="secondary"
              :label="$t('pages.edit.actions.section.add.image')"
              @click="addSection('image')"
            />
            <BaseButton
              layout="label"
              type="button"
              variant="secondary"
              :label="$t('pages.edit.actions.section.add.image-text')"
              @click="addSection('image-text')"
            />
          </div>

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
              v-if="errors['']"
              class="error"
            >
              {{ $t(errors['']) }}
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

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
    max-width: 70ch;
    margin: 0 auto;
    margin-block-end: var(--space-2xl);
  }

  .section-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
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
</style>
