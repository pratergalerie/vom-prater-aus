<script lang="ts" setup>
  import StoriesGrid from '~/components/StoriesGrid.vue'

  // const viewMode = ref<'list' | 'explorer'>('list')
  // const showSearchDialog = ref(false)

  // Handle search dialog filter results
  // const handleSearchFilter = (filteredResults: Story[]) => {
  //   filteredStories.value = filteredResults
  // }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">{{ $t('pages.stories.index.title') }}</h1>
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

<style scoped>
  .page-header {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: space-between;
  }

  .page-title {
    margin: 0;
    font-size: 2.5rem;
  }
</style>
