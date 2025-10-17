<script lang="ts" setup>
  import { useGetStory } from '~/composables/useGetStory'

  const route = useRoute()
  const { strapiUrl } = useRuntimeConfig().public

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
      <!-- Title -->
      <div
        v-if="index === 0"
        class="hero"
        :style="{ placeItems: section.image === null ? 'center' : undefined }"
      >
        <NuxtImg
          v-if="section.image !== null"
          :src="`${strapiUrl}${section.image.url}`"
          :alt="section.image.alternativeText ?? ''"
          class="image"
        />

        <div class="title-container">
          <div class="title">
            <h1>{{ storyData.title }}</h1>

            <div class="info">
              <span>
                {{
                  $t('pages.stories.story.memoryBy') +
                  ' ' +
                  storyData?.authorName
                }}
              </span>
              <div class="year">
                <Icon name="mdi:calendar" />
                <span>{{ storyData.year }}</span>
              </div>
            </div>
          </div>
          <div class="cutout"></div>
        </div>
      </div>

      <!-- Text -->
      <p
        v-if="section.text !== null"
        class="text"
      >
        <NuxtImg
          v-if="section.image !== null && index > 0"
          :src="`${strapiUrl}${section.image.url}`"
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

  .hero {
    display: grid;
    width: 100%;

    & img {
      grid-row: 1 / 7;
      grid-column: 1 / 1;
      height: 600px;
    }
  }

  .title-container {
    position: relative;
    grid-row: 6 / 8;
    grid-column: 1 / 1;
    width: 100%;
    max-width: 600px;

    & .title {
      display: flex;
      flex-direction: column;
      gap: var(--space-3xs);
      justify-content: center;
      padding: var(--space-xl) var(--space-l);
      background-color: var(--color-mustard);
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
        53.76% 93.76%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );

      & h1 {
        font-size: var(--step-2);
        text-wrap: inherit;
      }
    }

    .info {
      display: flex;
      gap: var(--space-xs);
      justify-content: space-between;

      & .year {
        display: flex;
        gap: var(--space-3xs);
        align-items: center;
      }
    }

    & .cutout {
      position: absolute;
      right: 20%;
      bottom: 0;
      width: 70%;
      height: 15%;
      background-color: var(--color-mint);
      clip-path: polygon(
        23% 2%,
        45% 0%,
        67% 4%,
        89% 2%,
        98% 15%,
        96% 38%,
        99% 52%,
        95% 71%,
        89% 85%,
        76% 92%,
        52% 98%,
        31% 95%,
        12% 89%,
        15% 12%
      );
    }
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
