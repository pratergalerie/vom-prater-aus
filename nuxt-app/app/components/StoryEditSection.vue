<script setup lang="ts">
  type Type = 'image' | 'image-text' | 'text'

  const props = withDefaults(
    defineProps<{
      type: Type
      index: number
      imageUrl: string | null
      lastSection?: boolean
    }>(),
    { lastSection: false }
  )
</script>

<template>
  <section>
    <Divider
      type="horizontal"
      color="var(--color-black)"
      width="40%"
      margin="var(--space-xs) 0"
    />
    <ImageUploadArea
      v-if="type === 'image' || type === 'image-text'"
      :required="true"
      :name="`section${props.index}Image`"
      :image-url="imageUrl"
      :label="$t('pages.edit.form.sectionImage.label')"
    />
    <BaseTextarea
      v-if="type === 'text' || type === 'image-text'"
      :required="true"
      :name="`section${props.index}Text`"
      :label="$t('pages.edit.form.bodyText.label')"
    />
  </section>
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    align-items: center;
    justify-content: center;
    margin-block-end: var(--space-2xl);
  }
</style>
