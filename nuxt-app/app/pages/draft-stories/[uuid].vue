<script lang="ts" setup>
  import ImageUploadArea from '~/components/ImageUploadArea.vue'
  import { useGetDraftStory } from '~/composables/useGetDraftStory'
  import { useForm } from 'vee-validate'
  import { useUpdateDraftStory } from '~/composables/useUpdateDraftStory'

  const route = useRoute()
  const uuid = route.params.uuid as string

  const { update, pending } = useUpdateDraftStory(uuid)

  const { data: storyData, status, error } = await useGetDraftStory(uuid)

  const { values, handleSubmit } = useForm({
    initialValues: {
      bodyText: storyData?.value?.sections[0]?.text ?? '',
      submitStory: false,
      coverImage: null,
    },
  })
  const isSubmitStoryChecked = computed(() => values.submitStory)

  const onSubmit = handleSubmit(async (values) => {
    // Story is saved
    if (!values.submitStory) {
      const { coverImage, bodyText } = values
      await update({
        sections: [
          {
            text: bodyText,
            image: coverImage,
          },
        ],
      })
      // Story is submitted
    } else {
      const response = await update({
        lifecycleState: 'submitted',
      })

      if (response.type === 'ok') {
        await navigateTo({ path: `/draft-stories/submitted` })
      }
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
        <div class="submit">
          <BaseButton
            type="submit"
            :disabled="pending"
            :variant="isSubmitStoryChecked ? 'secondary' : 'primary'"
            layout="label-icon"
            class="button"
            :label="
              isSubmitStoryChecked
                ? $t('pages.edit.actions.submit')
                : $t('pages.edit.actions.save')
            "
          />
          <BaseCheckbox name="submitStory">
            <template #label>
              <p>{{ $t('pages.edit.actions.submitCheckbox') }}</p>
            </template>
          </BaseCheckbox>
        </div>
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

      & .submit {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        align-items: center;
        width: max-content;
      }
    }
  }
</style>
