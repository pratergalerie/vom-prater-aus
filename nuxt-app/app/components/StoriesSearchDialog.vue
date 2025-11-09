<script setup lang="ts">
  import { toTypedSchema } from '@vee-validate/zod'
  import { useForm } from 'vee-validate'
  import * as z from 'zod'
  import { useGetKeywords } from '~/composables/useGetKeywords'
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

  const localeOptions = [
    'sq', // Albanian
    'hy', // Armenian
    'az', // Azerbaijani
    'eu', // Basque
    'be', // Belarusian
    'bs', // Bosnian
    'bg', // Bulgarian
    'ca', // Catalan
    'hr', // Croatian
    'cs', // Czech
    'da', // Danish
    'de', // Deutsch (German)
    'nl', // Dutch
    'en', // English
    'et', // Estonian
    'fi', // Finnish
    'fr', // French
    'ka', // Georgian
    'el', // Greek
    'hu', // Hungarian
    'is', // Icelandic
    'ga', // Irish (Gaeilge)
    'it', // Italian
    'kk', // Kazakh
    'ku', // Kurdish
    'lv', // Latvian
    'lt', // Lithuanian
    'lb', // Luxembourgish
    'mk', // Macedonian
    'mt', // Maltese
    'no', // Norwegian
    'pl', // Polish
    'pt', // Portuguese
    'ro', // Romanian
    'ru', // Russian
    'sr', // Serbian
    'sk', // Slovak
    'sl', // Slovenian
    'es', // Spanish
    'sv', // Swedish
    'tr', // Turkish
    'uk', // Ukrainian
    'cy', // Welsh (Cymraeg)
  ] as const

  // Validation schema reusing storyYear validation pattern
  const validationSchema = toTypedSchema(
    z.object({
      searchQuery: z.string().optional(),
      storyLanguage: z.string().optional(),
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
      storyLanguage: '',
      yearStart: '',
      yearEnd: '',
    },
  })

  // Search and filter state
  const localSelectedKeywords = ref<string[]>([])

  // Applied filter state (what's actually being used for filtering)
  const appliedSearchQuery = ref('')
  const appliedKeywords = ref<string[]>([])
  const appliedLanguage = ref<string>('')
  const appliedYearStart = ref<number | null>(null)
  const appliedYearEnd = ref<number | null>(null)

  // Sync selectedKeywords from parent when dialog opens
  watch(isOpen, (newValue) => {
    if (newValue && props.selectedKeywords) {
      localSelectedKeywords.value = [...props.selectedKeywords]
      appliedKeywords.value = [...props.selectedKeywords]
    }
  })

  // Fetch all keywords from the API
  const { data: allKeywords } = await useGetKeywords()

  // Get unique keywords from API
  const uniqueKeywords = computed(() => {
    if (!allKeywords.value) return []
    return allKeywords.value.map(
      (keyword: { documentId?: string; name: string }) => ({
        id: keyword.documentId ?? '',
        name: keyword.name,
      })
    )
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

      // Language filter
      const languageMatch =
        !appliedLanguage.value || story.language === appliedLanguage.value

      // Year range filter
      const yearMatch =
        (appliedYearStart.value === null ||
          story.year >= appliedYearStart.value) &&
        (appliedYearEnd.value === null || story.year <= appliedYearEnd.value)

      return searchMatch && keywordMatch && languageMatch && yearMatch
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
    appliedLanguage.value = formValues.storyLanguage || ''
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
    appliedLanguage.value = ''
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

      <!-- Language Filter -->
      <div class="language-section">
        <BaseSelect
          name="storyLanguage"
          :required="false"
          :label="$t('components.storiesSearchDialog.languageLabel')"
          :placeholder="
            $t('components.storiesSearchDialog.languagePlaceholder')
          "
        >
          <template #options>
            <option
              v-for="locale in localeOptions"
              :key="locale"
              :value="locale"
            >
              {{ $t(`languages.${locale}`) }}
            </option>
          </template>
        </BaseSelect>
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
