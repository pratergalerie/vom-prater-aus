<script lang="ts" setup>
  import type { Story } from '~~/types/strapi'
  import StoriesGrid from '~/components/StoriesGrid.vue'
  import StoriesSearchDialog from '~/components/StoriesSearchDialog.vue'

  const { t } = useI18n()

  // Keyword filtering state
  const selectedKeywords = ref<string[]>([])
  const showSearchDialog = ref(false)
  const filteredStories = ref<Story[] | null>(null)

  // Fetch all stories with keyword filtering
  const {
    data: storiesData,
    status,
    error,
  } = await useGetStories({ keywords: selectedKeywords })

  // Compute the stories to display (either filtered or all)
  const displayStories = computed(() => {
    return filteredStories.value ?? storiesData.value
  })

  // Check if there's an active filter
  const hasActiveFilter = computed(() => {
    return selectedKeywords.value.length > 0 || filteredStories.value !== null
  })

  // Handle keyword clicks from the grid
  const handleKeywordClick = async (name: string, selected: boolean) => {
    if (selected) {
      selectedKeywords.value.push(name)
    } else {
      selectedKeywords.value = selectedKeywords.value.filter(
        (keyword) => keyword !== name
      )
    }
    // Clear advanced filters when clicking keywords
    filteredStories.value = null
  }

  // Handle advanced search dialog filter results
  const handleSearchFilter = (results: Story[]) => {
    filteredStories.value = results
  }

  // Handle keyword updates from the search dialog
  const handleKeywordsUpdate = (keywords: string[]) => {
    selectedKeywords.value = keywords
  }

  useHead({
    title: `Vom Prater aus | ${t('pages.stories.index.title')}`,
  })
</script>

<template>
  <div>
    <h1>{{ $t('pages.stories.index.title') }}</h1>

    <!-- Loading state -->
    <div
      v-if="status === 'pending'"
      class="status-container"
    >
      <p>{{ $t('pages.stories.index.loading') }}</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="status-container error"
    >
      <p>{{ $t('pages.stories.index.error') }}</p>
    </div>

    <!-- No stories matching filter -->
    <div
      v-else-if="displayStories?.length === 0 && hasActiveFilter"
      class="status-container"
    >
      <p>{{ $t('pages.stories.index.noStoriesMatchingFilter') }}</p>
    </div>

    <!-- No stories at all -->
    <div
      v-else-if="displayStories?.length === 0"
      class="status-container"
    >
      <p>{{ $t('pages.stories.index.noStories') }}</p>
    </div>

    <!-- Stories grid with keyword filtering -->
    <StoriesGrid
      v-else
      :stories="displayStories"
      :selected-keywords="selectedKeywords"
      :on-keyword-click="handleKeywordClick"
    />

    <!-- Advanced Filter -->
    <StoriesSearchDialog
      v-model:is-open="showSearchDialog"
      :stories="storiesData"
      :selected-keywords="selectedKeywords"
      @filter="handleSearchFilter"
      @update:selected-keywords="handleKeywordsUpdate"
    />

    <!-- Filter button -->
    <div class="filter-button">
      <BaseButton
        variant="primary"
        layout="label-icon"
        :label="$t('pages.stories.index.searchButton')"
        @click="showSearchDialog = true"
      />
    </div>
  </div>
</template>

<style scoped>
  .status-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    min-height: 400px;

    & p {
      font-size: var(--step-1);
      font-weight: 600;
    }
  }

  .filter-button {
    position: sticky;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding-bottom: var(--space-m);
  }
</style>
