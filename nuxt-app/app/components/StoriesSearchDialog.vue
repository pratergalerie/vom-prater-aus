<script setup lang="ts">
  import { toTypedSchema } from '@vee-validate/zod'
  import { useForm } from 'vee-validate'
  import * as z from 'zod'
  import type { Story } from '~~/types/strapi'

  const props = defineProps<{
    stories: Story[]
    selectedKeywords?: string[]
  }>()

  const emit = defineEmits<{
    (e: 'filter', filteredStories: Story[]): void
    (e: 'update:selectedKeywords', keywords: string[]): void
  }>()

  const isOpen = defineModel<boolean>('is-open', { default: false })

  // Validation schema reusing storyYear validation pattern
  const validationSchema = toTypedSchema(
    z.object({
      searchQuery: z.string().optional(),
      yearStart: z.coerce
        .number({
          message: 'pages.create.form.inputs.storyYear.errors.required',
        })
        .int({
          message: 'pages.create.form.inputs.storyYear.errors.invalid',
        })
        .min(1831, {
          message: 'pages.create.form.inputs.storyYear.errors.min',
        })
        .max(2017, {
          message: 'pages.create.form.inputs.storyYear.errors.max',
        })
        .optional()
        .or(z.literal('')),
      yearEnd: z.coerce
        .number({
          message: 'pages.create.form.inputs.storyYear.errors.required',
        })
        .int({
          message: 'pages.create.form.inputs.storyYear.errors.invalid',
        })
        .min(1831, {
          message: 'pages.create.form.inputs.storyYear.errors.min',
        })
        .max(2017, {
          message: 'pages.create.form.inputs.storyYear.errors.max',
        })
        .optional()
        .or(z.literal('')),
    })
  )

  const { handleSubmit, resetForm } = useForm({
    validationSchema,
    initialValues: {
      searchQuery: '',
      yearStart: '',
      yearEnd: '',
    },
  })

  // Search and filter state
  const localSelectedKeywords = ref<string[]>([])

  // Applied filter state (what's actually being used for filtering)
  const appliedSearchQuery = ref('')
  const appliedKeywords = ref<string[]>([])
  const appliedYearStart = ref<number | null>(null)
  const appliedYearEnd = ref<number | null>(null)

  // Sync selectedKeywords from parent when dialog opens
  watch(isOpen, (newValue) => {
    if (newValue && props.selectedKeywords) {
      localSelectedKeywords.value = [...props.selectedKeywords]
      appliedKeywords.value = [...props.selectedKeywords]
    }
  })

  // Get unique keywords from stories
  const uniqueKeywords = computed(() => {
    const keywordMap = new Map<string, { id: string; name: string }>()
    props.stories.forEach((story) => {
      story.keywords.forEach((keyword) => {
        if (!keywordMap.has(keyword.name)) {
          keywordMap.set(keyword.name, {
            id: keyword.documentId ?? '',
            name: keyword.name,
          })
        }
      })
    })
    return Array.from(keywordMap.values())
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
          keyword.name
            .toLowerCase()
            .includes(appliedSearchQuery.value.toLowerCase())
        )

      // Keywords filter
      const keywordMatch =
        appliedKeywords.value.length === 0 ||
        appliedKeywords.value.some((selectedKeyword) =>
          story.keywords.some((keyword) => keyword.name === selectedKeyword)
        )

      // Year range filter
      const yearMatch =
        (appliedYearStart.value === null ||
          story.year >= appliedYearStart.value) &&
        (appliedYearEnd.value === null || story.year <= appliedYearEnd.value)

      return searchMatch && keywordMatch && yearMatch
    })
  })

  function handleKeywordToggle(keyword: string) {
    const index = localSelectedKeywords.value.indexOf(keyword)
    if (index > -1) {
      localSelectedKeywords.value.splice(index, 1)
    } else {
      localSelectedKeywords.value.push(keyword)
    }
  }

  const onSubmit = handleSubmit((formValues) => {
    // Apply the current input values to the applied filter state
    appliedSearchQuery.value = formValues.searchQuery || ''
    appliedKeywords.value = [...localSelectedKeywords.value]
    appliedYearStart.value =
      typeof formValues.yearStart === 'number' ? formValues.yearStart : null
    appliedYearEnd.value =
      typeof formValues.yearEnd === 'number' ? formValues.yearEnd : null

    // Emit the applied keywords to sync back to parent
    emit('update:selectedKeywords', appliedKeywords.value)

    // Emit the filtered results
    emit('filter', filteredStories.value)
  })

  function handleClearFilters() {
    // Clear form inputs
    resetForm()

    // Clear both input and applied filter states
    localSelectedKeywords.value = []

    appliedSearchQuery.value = ''
    appliedKeywords.value = []
    appliedYearStart.value = null
    appliedYearEnd.value = null

    // Emit the cleared keywords to sync back to parent
    emit('update:selectedKeywords', [])

    // Emit the unfiltered results
    emit('filter', props.stories)
  }
</script>

<template>
  <BaseDialog
    v-model:is-open="isOpen"
    class="search-dialog"
    :width="500"
  >
    <form
      class="search-dialog-content"
      @submit="onSubmit"
    >
      <!-- Search Input -->
      <div class="search-section">
        <BaseInput
          name="searchQuery"
          type="text"
          :label="$t('components.storiesSearchDialog.searchLabel')"
          :placeholder="$t('components.storiesSearchDialog.searchPlaceholder')"
        />
      </div>

      <!-- Keywords Filter -->
      <div class="keywords-section">
        <span class="keywords-label">
          {{ $t('components.storiesSearchDialog.keywordsLabel') }}
        </span>
        <div class="keywords-list">
          <BaseKeyword
            v-for="keyword in uniqueKeywords"
            :id="keyword.id"
            :key="keyword.id"
            :name="keyword.name"
            :selected="localSelectedKeywords.includes(keyword.name)"
            @click="handleKeywordToggle(keyword.name)"
          />
        </div>
      </div>

      <!-- Year Range Filter -->
      <div class="year-section">
        <div class="year-inputs">
          <BaseInput
            name="yearStart"
            type="number"
            :label="$t('components.storiesSearchDialog.yearStart')"
            :placeholder="
              $t('components.storiesSearchDialog.yearStartPlaceholder')
            "
          />
          <BaseInput
            name="yearEnd"
            type="number"
            :label="$t('components.storiesSearchDialog.yearEnd')"
            :placeholder="
              $t('components.storiesSearchDialog.yearEndPlaceholder')
            "
          />
        </div>
      </div>

      <!-- Actions & Results -->
      <div class="actions">
        <BaseButton
          type="button"
          variant="secondary"
          layout="label-icon"
          :label="$t('components.storiesSearchDialog.clearFilters')"
          class="clear-filters-button"
          @click="handleClearFilters"
        />
        <BaseButton
          type="submit"
          variant="primary"
          layout="label-icon"
          :label="$t('components.storiesSearchDialog.applyFilters')"
          class="apply-filters-button"
        />
      </div>

      <div class="results-section">
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
    </form>
  </BaseDialog>
</template>

<style scoped>
  .search-dialog-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  .search-section {
    width: 100%;
  }

  .keywords-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .keywords-label {
    font-weight: 600;
  }

  .keywords-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .year-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .year-inputs {
    display: flex;
    gap: var(--space-xs);

    :deep(.input-wrapper) {
      flex: 1;
    }
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }

  .results-count {
    color: var(--color-text-light);
  }

  .actions {
    display: flex;
    gap: var(--space-xs);
    align-items: center;
    justify-content: center;
  }
</style>
