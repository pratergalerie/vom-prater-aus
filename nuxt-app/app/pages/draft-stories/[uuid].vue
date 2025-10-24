<script lang="ts" setup>
  import ImageUploadArea from '~/components/ImageUploadArea.vue'
  import { useGetDraftStory } from '~/composables/useGetDraftStory'
  import { useForm } from 'vee-validate'
  import { useUpdateDraftStory } from '~/composables/useUpdateDraftStory'
  import { useUploadImage } from '~/composables/useUploadImage'
  import { getStrapiImageUrl } from '~/utils/strapi'

  const route = useRoute()
  const uuid = route.params.uuid as string

  const { update, pending: pendingUpdate } = useUpdateDraftStory(uuid)
  const { upload, pending: pendingUpload } = useUploadImage()
  const { data: storyData, status, error } = await useGetDraftStory(uuid)
  const isPending = computed(() => pendingUpload || pendingUpdate)

  const { values, handleSubmit } = useForm<{
    bodyText: string | null
    submitStory: boolean
    coverImage: File | null
  }>({
    initialValues: {
      bodyText: storyData?.value?.sections[0]?.text ?? '',
      submitStory: false,
      coverImage: null,
    },
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

  const onSubmit = handleSubmit(async (values) => {
    const { coverImage, bodyText } = values
    const isSubmitting = values.submitStory
    let coverImageId

    if (coverImage) {
      const response = await upload(coverImage) // Then update the entry

      if (response.type === 'ok') {
        coverImageId = response.data?.id
      }
    }

    const response = await update({
      sections: [
        {
          text: bodyText,
          image: coverImageId ?? null,
        },
      ],
      ...(isSubmitting && { lifecycleState: 'submitted' }),
    })

    if (isSubmitting && response.type === 'ok') {
      await navigateTo({ path: `/draft-stories/submitted` })
    }
  })
</script>
<template>
  <div class="wrapper">
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
          :label="$t('pages.edit.form.bodyText.label')"
        />
      </section>

      <StoryEditActions :style="{ position: 'sticky' }">
        <template #actions>
          <div class="submit">
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
            <BaseCheckbox name="submitStory">
              <template #label>
                <p>{{ $t('pages.edit.actions.submitCheckbox') }}</p>
              </template>
            </BaseCheckbox>
          </div>
        </template>
      </StoryEditActions>
    </form>
  </div>
</template>

<style scoped>
  .wrapper {
    position: relative;
    height: 100%;

    & .status {
      display: flex;
      flex-wrap: wrap;
      place-content: center;
      height: 100%;
      font-size: var(--step-1);
      font-weight: 600;
    }

    & section {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
      align-items: center;
      justify-content: center;
      margin-block-end: var(--space-2xl);
    }
  }

  .submit {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    align-items: center;
    width: max-content;
  }
</style>
