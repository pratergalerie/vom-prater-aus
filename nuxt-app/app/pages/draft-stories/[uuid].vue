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

      <div class="actions-wrapper">
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
        <div class="background"></div>
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

  .actions-wrapper {
    position: sticky;
    bottom: 0;
    z-index: 1000;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;

    & .actions {
      z-index: 3;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      max-width: var(--max-width);
      padding: var(--space-l);
      background-color: var(--color-beige);
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
        61.69% 78.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );

      & .submit {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        align-items: center;
        width: max-content;
      }
    }

    & .background {
      position: absolute;
      top: 2px;
      z-index: 1;
      grid-area: stack;
      width: 100%;
      height: 100%;
      background-color: var(--color-grey-light);
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
        61.69% 78.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );
      transform: scaleX(1.01) scaleY(1.06);
    }
  }
</style>
