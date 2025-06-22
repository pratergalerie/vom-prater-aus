<script setup lang="ts">
  import type { Story } from '~/types/frontend'

  const props = defineProps<{
    stories: Story[]
  }>()

  const emit = defineEmits<{
    (e: 'filter', filteredStories: Story[]): void
  }>()

  const api = useAPI()
  const isOpen = defineModel<boolean>('is-open', { default: false })

  // Search and filter state (current input values)
  const searchQuery = ref('')
  const selectedKeywords = ref<string[]>([])
  const yearRange = ref<[number, number]>([1980, 2024])

  // Applied filter state (what's actually being used for filtering)
  const appliedSearchQuery = ref('')
  const appliedKeywords = ref<string[]>([])
  const appliedYearRange = ref<[number, number]>([1980, 2024])

  // Keywords data
  const { data: keywordsData } = await api.getKeywords()
  const keywords = computed(() => keywordsData.value || [])

  // Get year range from stories
  const storyYears = computed(() => {
    if (!props.stories.length) return [1980, 2024]
    const years = props.stories.map((story) => story.year)
    return [Math.min(...years), Math.max(...years)]
  })

  // Initialize year range with actual story data
  onMounted(() => {
    if (storyYears.value[0] !== 1980 || storyYears.value[1] !== 2024) {
      yearRange.value = [
        storyYears.value[0] ?? 1980,
        storyYears.value[1] ?? 2024,
      ]
      appliedYearRange.value = [
        storyYears.value[0] ?? 1980,
        storyYears.value[1] ?? 2024,
      ]
    }
  })

  // Filter stories based on applied search criteria
  const filteredStories = computed(() => {
    return props.stories.filter((story) => {
      // Search query filter (title and keywords)
      const searchMatch =
        !appliedSearchQuery.value ||
        story.title
          .toLowerCase()
          .includes(appliedSearchQuery.value.toLowerCase()) ||
        story.keywords.some((keyword) =>
          keyword.word
            .toLowerCase()
            .includes(appliedSearchQuery.value.toLowerCase())
        )

      // Keywords filter
      const keywordMatch =
        appliedKeywords.value.length === 0 ||
        appliedKeywords.value.some((selectedKeyword) =>
          story.keywords.some((keyword) => keyword.word === selectedKeyword)
        )

      // Year range filter
      const yearMatch =
        story.year >= appliedYearRange.value[0] &&
        story.year <= appliedYearRange.value[1]

      return searchMatch && keywordMatch && yearMatch
    })
  })

  function handleKeywordToggle(keyword: string) {
    const index = selectedKeywords.value.indexOf(keyword)
    if (index > -1) {
      selectedKeywords.value.splice(index, 1)
    } else {
      selectedKeywords.value.push(keyword)
    }
  }

  function handleApplyFilters() {
    // Apply the current input values to the applied filter state
    appliedSearchQuery.value = searchQuery.value
    appliedKeywords.value = [...selectedKeywords.value]
    appliedYearRange.value = [...yearRange.value]

    // Emit the filtered results
    emit('filter', filteredStories.value)
  }

  function handleClearFilters() {
    // Clear both input and applied filter states
    searchQuery.value = ''
    selectedKeywords.value = []
    yearRange.value = [storyYears.value[0] ?? 1980, storyYears.value[1] ?? 2024]

    appliedSearchQuery.value = ''
    appliedKeywords.value = []
    appliedYearRange.value = [
      storyYears.value[0] ?? 1980,
      storyYears.value[1] ?? 2024,
    ]

    // Emit the unfiltered results
    emit('filter', props.stories)
  }
</script>

<template>
  <BaseDialog
    v-model:is-open="isOpen"
    :title="$t('components.storiesSearchDialog.title')"
    :width="500"
    class="search-dialog"
  >
    <div class="search-dialog-content">
      <!-- Search Input -->
      <div class="search-section">
        <BaseInput
          id="story-search"
          v-model="searchQuery"
          type="text"
          :label="$t('components.storiesSearchDialog.searchLabel')"
          :placeholder="$t('components.storiesSearchDialog.searchPlaceholder')"
        />
      </div>

      <!-- Keywords Filter -->
      <div class="keywords-section">
        <h3 class="section-title">
          {{ $t('components.storiesSearchDialog.popularKeywords') }}
        </h3>
        <div class="keywords-list">
          <BaseKeyword
            v-for="keyword in keywords"
            :id="keyword.id"
            :key="keyword.id"
            :keyword="keyword.word"
            :selected="selectedKeywords.includes(keyword.word)"
            @click="handleKeywordToggle(keyword.word)"
          />
        </div>
      </div>

      <!-- Year Range Filter -->
      <div class="year-section">
        <BaseRangeSlider
          v-if="storyYears[0] && storyYears[1]"
          id="year-range"
          v-model="yearRange"
          :label="$t('components.storiesSearchDialog.yearRange')"
          :min="storyYears[0]"
          :max="storyYears[1]"
          :step="1"
        />
      </div>

      <!-- Results and Actions -->
      <div class="results-section">
        <div class="results-info">
          <span class="results-count">
            {{
              filteredStories.length > 0
                ? $t('components.storiesSearchDialog.resultsCount', {
                    count: filteredStories.length,
                    total: stories.length,
                  })
                : $t('components.storiesSearchDialog.noResults')
            }}
          </span>
        </div>

        <div class="actions">
          <BaseButton
            type="secondary"
            variant="label-icon"
            :label="$t('components.storiesSearchDialog.clearFilters')"
            icon="mdi:refresh"
            class="clear-filters-button"
            @click="handleClearFilters"
          />
          <BaseButton
            type="primary"
            variant="label-icon"
            :label="$t('components.storiesSearchDialog.applyFilters')"
            icon="mdi:filter"
            class="apply-filters-button"
            @click="handleApplyFilters"
          />
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
  .search-dialog {
    &:deep(.dialog-content-inner) {
      padding: 50px 2rem 70px;
    }
  }

  .search-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .search-section {
    width: 100%;
  }

  .keywords-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    margin: 0;
    font-size: 1rem;
  }

  .keywords-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .year-section {
    width: 100%;
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin-top: -1.5rem;
  }

  .results-info {
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle,
      rgb(255 255 255 / 100%) 0%,
      rgb(255 255 255 / 50%) 100%
    );
  }

  .results-count {
    font-family: var(--font-link);
    font-size: 0.9rem;
    color: var(--color-text-light);
  }

  .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .clear-filters-button,
  .apply-filters-button {
    width: 200px;
    min-width: 200px;
    height: 40px;
  }
</style>
