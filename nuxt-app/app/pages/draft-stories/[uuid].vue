<script lang="ts" setup>
  import { useGetDraftStory } from '~/composables/useGetDraftStory'

  const route = useRoute()

  const uuid = route.params.uuid as string
  const { data: storyData, status, error } = await useGetDraftStory(uuid)
</script>

<template>
  <div>
    <div>
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

      <section v-else>
        {{ storyData.title }}
      </section>
    </div>
  </div>
</template>

<style scoped></style>
