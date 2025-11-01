<script lang="ts" setup>
  import StoriesGrid from '~/components/StoriesGrid.vue'
  const { t } = useI18n()

  // const viewMode = ref<'list' | 'explorer'>('list')
  // const showSearchDialog = ref(false)

  // Handle search dialog filter results
  // const handleSearchFilter = (filteredResults: Story[]) => {
  //   filteredStories.value = filteredResults
  // }

  useHead({
    title: `Vom Prater aus | ${t('pages.stories.index.title')}`,
  })
</script>

<template>
  <div>
    <div>
      <h1>{{ $t('pages.stories.index.title') }}</h1>
      <StoriesGrid />

      <!-- <StoriesActions
        v-model:view-mode="viewMode"
        v-model:show-search-dialog="showSearchDialog"
      />

      <StoriesSearchDialog
        v-model:is-open="showSearchDialog"
        :stories="stories"
        @filter="handleSearchFilter"
      /> -->
    </div>
  </div>
</template>

<style scoped></style>
