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

    <!-- Stories grid with keyword filtering -->
    <StoriesGrid
      :stories="displayStories"
      :selected-keywords="selectedKeywords"
      :on-keyword-click="handleKeywordClick"
      :status="status"
      :error="error"
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
