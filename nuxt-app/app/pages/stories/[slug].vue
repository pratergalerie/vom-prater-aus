<script lang="ts" setup>
  import { useGetStory } from '~/composables/useGetStory'
  import { getStrapiImageUrl } from '~/utils/strapi'

  const route = useRoute()

  const slug = route.params.slug as string
  const { data: storyData, status, error } = await useGetStory(slug)

  const coverSection = computed(() => storyData.value?.sections[0])
  const otherSections = computed(() => storyData.value?.sections.slice(1) ?? [])
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

    <div
      v-else
      class="stack"
    >
      <StoryHeroLayout
        v-if="coverSection"
        :layout="coverSection.type === 'image' ? 'image' : 'text'"
      >
        <template
          v-if="coverSection.type === 'image'"
          #cover
        >
          <NuxtImg
            v-if="coverSection.image"
            :src="getStrapiImageUrl(coverSection.image.url)"
            :alt="coverSection.image.alternativeText ?? ''"
          />
        </template>

        <template #titleBlock>
          <StoryTitleLayout
            ><template #title
              ><h1>{{ storyData?.title }}</h1></template
            >
            <template #author>
              <span>
                {{
                  `${$t('pages.stories.story.memoryBy')} ${storyData?.authorName}`
                }}
              </span>
            </template>
            <template #year>
              <div class="year">
                <Icon name="mdi:calendar" />
                <span>{{ storyData?.year }}</span>
              </div>
            </template>
          </StoryTitleLayout>
        </template>
      </StoryHeroLayout>

      <section
        v-for="(section, index) in otherSections"
        :key="index"
      >
        <!-- Image Section -->
        <NuxtImg
          v-if="section.type === 'image' && section.image"
          class="image"
          :src="getStrapiImageUrl(section.image.url)"
          :alt="section.image.alternativeText ?? ''"
        />

        <!-- Text Section -->
        <p
          v-if="section.type === 'text'"
          class="text"
        >
          {{ section.text }}
        </p>

        <!-- Image+Text Section -->
        <p
          v-if="section.type === 'image-text'"
          class="text"
        >
          <NuxtImg
            v-if="section.image"
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
          v-if="index !== otherSections.length - 1"
          type="horizontal"
          color="var(--color-black)"
          width="40%"
          margin="var(--space-xs) 0"
        />
      </section>
    </div>
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

  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
  }

  .image {
    max-width: 70ch;
    max-height: 600px;
  }

  .text {
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

  .year {
    display: flex;
    gap: var(--space-3xs);
    align-items: center;
    justify-content: flex-end;
  }
</style>
