<script setup lang="ts">
  type Layout = 'image' | 'image-text' | 'text'

  defineProps<{
    layout: Layout
    sectionId: string
    imageUrl: string | null
  }>()
</script>

<template>
  <section
    :class="{
      'layout-image-text': layout === 'image-text',
      'layout-text': layout === 'text',
    }"
  >
    <ImageUploadArea
      v-if="layout === 'image' || layout === 'image-text'"
      :required="true"
      :name="`section${sectionId}Image`"
      :image-url="imageUrl"
      :label="$t('pages.edit.form.sectionImage.label')"
      :description="$t('pages.edit.form.sectionImage.description')"
    />
    <BaseTextarea
      v-if="layout === 'text' || layout === 'image-text'"
      :required="true"
      :name="`section${sectionId}Text`"
      :label="$t('pages.edit.form.sectionText.label')"
    />
    <slot name="actions"></slot>
  </section>
</template>

<style scoped>
  section {
    display: grid;
    gap: var(--space-2xl);
    justify-items: center;
    max-width: 70ch;
    margin: 0 auto;

    &.layout-text {
      grid-template-rows: 70ch max-content;
    }

    &.layout-image-text {
      grid-template-rows: max-content 70ch max-content;
    }
  }
</style>
