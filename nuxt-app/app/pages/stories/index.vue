<script lang="ts" setup>
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
    showSearchDialog.value = false
  }

  useHead({
    title: `Vom Prater aus | ${t('pages.stories.index.title')}`,
  })
</script>

<template>
  <div>
    <div>
      <!-- Filter button -->
      <div class="filter-bar">
        <h1>{{ $t('pages.stories.index.title') }}</h1>

        <BaseButton
          variant="primary"
          layout="label-icon"
          :label="$t('pages.stories.index.filter')"
          icon="mdi:filter"
          @click="showSearchDialog = true"
        />
      </div>

      <!-- Stories grid with keyword filtering -->
      <StoriesGrid
        :stories="displayStories"
        :selected-keywords="selectedKeywords"
        :on-keyword-click="handleKeywordClick"
        :status="status"
        :error="error"
      />

      <!-- Advanced search dialog -->
      <StoriesSearchDialog
        v-model:is-open="showSearchDialog"
        :stories="storiesData"
        @filter="handleSearchFilter"
      />
    </div>
  </div>
</template>

<style scoped>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-l);
  }
</style>
