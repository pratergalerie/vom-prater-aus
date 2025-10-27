<script setup lang="ts">
  type Layout = 'image' | 'image-text' | 'text'

  withDefaults(
    defineProps<{
      layout: Layout
      index: number
      imageUrl: string | null
      lastSection?: boolean
    }>(),
    { lastSection: false }
  )
</script>

<template>
  <section
    :class="{
      'layout-image-text': layout === 'image-text',
      'layout-text': layout === 'text',
    }"
  >
    <Divider
      type="horizontal"
      color="var(--color-black)"
      width="40%"
      margin="var(--space-xs) 0"
    />
    <ImageUploadArea
      v-if="layout === 'image' || layout === 'image-text'"
      :required="true"
      :name="`section${index}Image`"
      :image-url="imageUrl"
      :label="$t('pages.edit.form.sectionImage.label')"
      :description="$t('pages.edit.form.sectionImage.description')"
    />
    <BaseTextarea
      v-if="layout === 'text' || layout === 'image-text'"
      :required="true"
      :name="`section${index}Text`"
      :label="$t('pages.edit.form.sectionText.label')"
    />
  </section>
</template>

<style scoped>
  section {
    display: grid;
    gap: var(--space-2xl);
    justify-items: center;
    max-width: 70ch;
    margin: 0 auto;
    margin-block-end: var(--space-2xl);

    &.layout-text {
      grid-template-rows: max-content 70ch;
    }

    &.layout-image-text {
      grid-template-rows: max-content max-content 70ch;
    }
  }
</style>
