<script lang="ts" setup>
  import ImageUploadArea from '~/components/ImageUploadArea.vue'
  import { useGetDraftStory } from '~/composables/useGetDraftStory'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { useUpdateDraftStory } from '~/composables/useUpdateDraftStory'
  import { useUploadImage } from '~/composables/useUploadImage'
  import { getStrapiImageUrl } from '~/utils/strapi'
  import * as z from 'zod'

  const validationSchema = toTypedSchema(
    z
      .object({
        coverImage: z.instanceof(File).optional(),
        coverImageId: z.number().optional().nullable(),
        bodyText: z.string(),
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
      })
      .refine(
        (data) => {
          return (
            data.coverImage ||
            Boolean(data.bodyText.length) ||
            data.coverImageId
          )
        },
        {
          message: 'pages.edit.form.errors.atLeast',
          path: [''], // applies error to the root level
        }
      )
  )

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

  const { values, handleSubmit, errors, isSubmitting } = useForm<{
    bodyText: string | null
    submitStory: boolean
    coverImage: File | null
    coverImageId: number | null
    storyTitle: string | null
    authorName: string | null
    storyYear: number | null
  }>({
    validationSchema,
    initialValues: {
      bodyText: bodyText,
      submitStory: false,
      coverImageId: coverImage?.id,
      storyTitle,
      authorName,
      storyYear,
    },
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

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
      let coverImageId = coverImageIdField

      if (coverImageField) {
        const response = await upload(coverImageField)

        if (response.type === 'ok') {
          coverImageId = response.data?.id ?? null
        }
      }

      const response = await update({
        title,
        authorName,
        year,
        sections: [
          {
            text: bodyText,
            image: coverImageId,
          },
        ],
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
      <section>
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

        <BaseTextarea
          name="bodyText"
          :label="`1. ${$t('pages.edit.form.bodyText.label')}`"
        />
      </section>

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
                layout="label-icon"
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
    margin-block-end: var(--space-2xl);
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
