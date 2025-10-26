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

  const { update, pending: pendingUpdate } = useUpdateDraftStory(uuid)
  const { upload, pending: pendingUpload } = useUploadImage()
  const { data: storyData, status, error } = await useGetDraftStory(uuid)
  const isPending = computed(() => pendingUpload || pendingUpdate)

  const { text: bodyText, image: coverImage } =
    storyData?.value?.sections[0] ?? {}

  const { values, handleSubmit, errors } = useForm<{
    bodyText: string | null
    submitStory: boolean
    coverImage: File | null
    coverImageId: number | null
  }>({
    validationSchema,
    initialValues: {
      bodyText: bodyText,
      submitStory: false,
      coverImageId: coverImage?.id,
    },
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

  const onSubmit = handleSubmit(
    async ({
      coverImage: coverImageField,
      coverImageId: coverImageIdField,
      bodyText,
    }) => {
      const isSubmitting = values.submitStory
      let coverImageId = coverImageIdField

      if (coverImageField) {
        const response = await upload(coverImageField)

        if (response.type === 'ok') {
          coverImageId = response.data?.id ?? null
        }
      }

      const response = await update({
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
            <StoryTitleBlock
              :title="storyData.title"
              :author-name="storyData.authorName"
              :year="storyData.year"
            />
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
                :disabled="isPending.value"
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
    gap: var(--space-s);
    align-items: center;
  }
</style>
