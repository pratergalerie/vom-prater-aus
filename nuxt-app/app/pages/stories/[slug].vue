<script lang="ts" setup>
  import { useGetStory } from '~/composables/useGetStory'
  import { getStrapiImageUrl } from '~/utils/strapi'

  const route = useRoute()

  const slug = route.params.slug as string
  const { data: storyData, status, error } = await useGetStory(slug)

  const coverSection = computed(() => {
    const firstSection = storyData.value?.sections[0]
    return firstSection?.type === 'image' ? firstSection : undefined
  })
  const otherSections = computed(() => {
    const firstSection = storyData.value?.sections[0]
    if (firstSection?.type === 'image') {
      return storyData.value?.sections.slice(1) ?? []
    }
    return storyData.value?.sections ?? []
  })

  useHead({
    title: `Vom Prater aus | ${storyData.value?.title}`,
  })
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
      <StoryHeroLayout :layout="coverSection ? 'image' : 'text'">
        <template
          v-if="coverSection"
          #cover
        >
          <CaptionImage
            v-if="coverSection.image"
            :img-attrs="{
              style: 'max-height: 600px',
            }"
            text-position="inline"
            :src="getStrapiImageUrl(coverSection.image.url)"
            :alt="coverSection.image.alternativeText ?? ''"
            :caption="`© ${storyData.authorName}`"
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

      <div class="section-wrapper">
        <template
          v-for="(section, index) in otherSections"
          :key="index"
        >
          <!-- Image Section -->
          <section v-if="section.type === 'image' && section.image">
            <CaptionImage
              :src="getStrapiImageUrl(section.image.url)"
              :alt="section.image.alternativeText ?? ''"
              :caption="`© ${storyData.authorName}`"
            />
          </section>

          <!-- Text Section -->
          <section v-else-if="section.type === 'text'">
            <p class="text">
              {{ section.text }}
            </p>
          </section>

          <!-- Image+Text Section -->
          <section v-else-if="section.type === 'image-text' && section.image">
            <p class="text">
              <CaptionImage
                class="inline-image"
                :style="{
                  float: index % 2 ? 'left' : 'right',
                  marginRight: index % 2 ? 'var(--step-0)' : undefined,
                  marginLeft: index % 2 ? undefined : 'var(--step-0)',
                }"
                :src="getStrapiImageUrl(section.image.url)"
                :alt="section.image.alternativeText ?? ''"
                :caption="`© ${storyData.authorName}`"
              />
              <span>{{ section.text }}</span>
            </p>
          </section>

          <Divider
            v-if="index !== otherSections.length - 1"
            type="horizontal"
            color="var(--color-black)"
            width="40%"
            margin="var(--space-xs) 0"
          />
        </template>
      </div>

      <Divider
        type="horizontal"
        color="var(--color-black)"
        width="100%"
        margin="var(--space-2xl) 0"
      />

      <div class="more-stories">
        <h2>
          {{ $t('pages.stories.story.moreStories.title') }}
        </h2>

        <StoriesGrid
          :max-items="3"
          layout="inline"
          :exclude-slug="slug"
          randomize
        />

        <BaseButton
          variant="primary"
          layout="label"
          :label="$t('pages.stories.story.moreStories.link')"
          href="/stories"
        />
      </div>
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

  .section-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 70ch;
  }

  .text {
    & .inline-image {
      display: inline;
      width: 50%;
      min-width: 300px;
      max-height: 400px;
      /* stylelint-disable-next-line custom-property-pattern */
      margin-bottom: var(--step--1);

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

  .more-stories {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
    align-items: center;
  }
</style>
