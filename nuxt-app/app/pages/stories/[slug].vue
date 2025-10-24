<script lang="ts" setup>
  import { useGetStory } from '~/composables/useGetStory'
  import { getStrapiImageUrl } from '~/utils/strapi'

  const route = useRoute()

  const slug = route.params.slug as string
  const { data: storyData, status, error } = await useGetStory(slug)
</script>

<template>
  <div>
    <!-- Loading state -->
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
        {{ $t('pages.stories.story.noStories') }}
      </p>
    </div>

    <section
      v-for="(section, index) in storyData.sections"
      v-else
      :key="index"
    >
      <StoryHeroLayout
        v-if="index === 0"
        :style="{ placeItems: section.image === null ? 'center' : undefined }"
      >
        <template #image>
          <NuxtImg
            v-if="section.image !== null"
            :src="getStrapiImageUrl(section.image.url)"
            :alt="section.image.alternativeText ?? ''"
            class="image"
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

      <!-- Text -->
      <p
        v-if="section.text !== null"
        class="text"
      >
        <NuxtImg
          v-if="section.image !== null && index > 0"
          :src="getStrapiImageUrl(section.image.url)"
          :alt="section.image.alternativeText ?? ''"
          :style="{
            float: index % 2 ? 'left' : 'right',
            marginRight: index % 2 ? 'var(--step-0)' : undefined,
            marginLeft: index % 2 ? undefined : 'var(--step-0)',
          }"
          class="inline-image"
        />
        {{ section.text }}
      </p>

      <Divider
        v-if="index !== storyData.sections.length - 1"
        type="horizontal"
        color="var(--color-black)"
        width="40%"
        margin="var(--space-xs) 0"
      />
    </section>
  </div>
</template>

<style scoped>
  .status-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
    margin-block-end: var(--space-2xl);
  }

  .text {
    width: 100%;

    & .inline-image {
      display: inline;
      width: 40%;
      min-width: 300px;
      max-height: 400px;
      margin-bottom: var(--step-0);

      @media (max-width: 600px) {
        width: 100%;
      }
    }
  }
</style>
