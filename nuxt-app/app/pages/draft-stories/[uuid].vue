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
      await update({
        lifecycleState: 'submitted',
      })
    }
  })
</script>
<template>
  <div class="wrapper">
    <div
      v-if="status === 'pending'"
      class="status-container"
    >
      <p>{{ $t('pages.stories.story.loading') }}</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="status-container error"
    >
      <p>{{ $t('pages.stories.story.error') }}</p>
    </div>

    <!-- No stories state -->
    <div
      v-else-if="storyData === undefined"
      class="status-container"
    >
      <p>
        {{ $t('pages.stories.story.unavailable"') }}
      </p>
    </div>

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

      <div class="actions">
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
      </div>
    </form>
  </div>
</template>

<style scoped>
  .wrapper {
    position: relative;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
    margin-block-end: var(--space-2xl);
  }

  .actions {
    position: sticky;
    bottom: 0;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    max-width: var(--max-width);
    padding: var(--space-s);
    padding-bottom: var(--space-xs);
    background-color: var(--color-beige);

    & .submit {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      align-items: center;
      width: max-content;
    }
  }
</style>
