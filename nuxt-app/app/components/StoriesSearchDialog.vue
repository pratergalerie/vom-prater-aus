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

  // Search and filter state
  const searchQuery = ref('')
  const selectedKeywords = ref<string[]>([])
  const yearRange = ref<[number, number]>([1980, 2024])

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
    }
  })

  // Filter stories based on search criteria
  const filteredStories = computed(() => {
    return props.stories.filter((story) => {
      // Search query filter (title and keywords)
      const searchMatch =
        !searchQuery.value ||
        story.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        story.keywords.some((keyword) =>
          keyword.word.toLowerCase().includes(searchQuery.value.toLowerCase())
        )

      // Keywords filter
      const keywordMatch =
        selectedKeywords.value.length === 0 ||
        selectedKeywords.value.some((selectedKeyword) =>
          story.keywords.some((keyword) => keyword.word === selectedKeyword)
        )

      // Year range filter
      const yearMatch =
        story.year >= yearRange.value[0] && story.year <= yearRange.value[1]

      return searchMatch && keywordMatch && yearMatch
    })
  })

  // Watch for filter changes and emit filtered results
  watch(
    [searchQuery, selectedKeywords, yearRange, filteredStories],
    () => {
      emit('filter', filteredStories.value)
    },
    { immediate: true }
  )

  function handleKeywordToggle(keyword: string) {
    const index = selectedKeywords.value.indexOf(keyword)
    if (index > -1) {
      selectedKeywords.value.splice(index, 1)
    } else {
      selectedKeywords.value.push(keyword)
    }
  }

  function handleClearFilters() {
    searchQuery.value = ''
    selectedKeywords.value = []
    yearRange.value = [storyYears.value[0] ?? 1980, storyYears.value[1] ?? 2024]
  }
</script>

<template>
  <BaseDialog
    v-model:is-open="isOpen"
    title="Search & Filter Stories"
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
          label="Search Stories"
          placeholder="Search by title or keywords..."
        />
      </div>

      <!-- Keywords Filter -->
      <div class="keywords-section">
        <h3 class="section-title">Popular Keywords</h3>
        <div class="keywords-list">
          <BaseKeyword
            v-for="keyword in keywords"
            :id="keyword.id"
            :key="keyword.id"
            :keyword="keyword.word"
            :class="{ selected: selectedKeywords.includes(keyword.word) }"
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
          label="Year Range"
          :min="storyYears[0]"
          :max="storyYears[1]"
          :step="1"
        />
      </div>

      <!-- Results and Actions -->
      <div class="results-section">
        <div class="results-info">
          <span class="results-count">
            {{ filteredStories.length }} of {{ stories.length }} stories
          </span>
        </div>

        <div class="actions">
          <BaseButton
            type="secondary"
            variant="label-icon"
            label="Clear Filters"
            icon="mdi:refresh"
            class="clear-filters-button"
            @click="handleClearFilters"
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
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
  }

  .results-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background: radial-gradient(
      circle,
      rgb(255 255 255 / 100%) 0%,
      rgb(255 255 255 / 0%) 100%
    );
    border-radius: 0.5rem;
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

  .clear-filters-button {
    width: 200px;
    min-width: 200px;
    height: 40px;
  }

  :deep(.keyword.selected) {
    --color-highlight: var(--color-mustard);

    color: var(--color-black);
    background: var(--color-mustard);
  }
</style>
