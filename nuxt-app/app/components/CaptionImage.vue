<script setup lang="ts">
  withDefaults(
    defineProps<{
      caption: string
      src: string
      alt: string
      imgAttrs?: Record<string, string>
      textPosition?: string
    }>(),
    { imgAttrs: () => ({}), textPosition: undefined }
  )
</script>

<template>
  <div class="image-caption">
    <NuxtPicture
      :src
      :alt
      :img-attrs="imgAttrs"
    /><span :class="{ 'caption-inline': textPosition === 'inline' }">{{
      caption
    }}</span>
  </div>
</template>

<style scoped>
  .image-caption {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    width: 100%;
    margin-block-end: var(--space-xs);
  }

  .caption-inline {
    position: absolute;
    top: 0;
    right: 0;
    padding: var(--space-2xs) var(--space-xs);
    margin: var(--space-xs);
    /* stylelint-disable-next-line custom-property-pattern */
    font-size: var(--step--1);
    text-align: center;
    background-color: var(--color-white);
    clip-path: polygon(
      0% 10%,
      9.22% 5.3%,
      21.5% -0.13%,
      47.76% 3.25%,
      98.35% 4%,
      98.64% 76.25%,
      97.26% 89.26%,
      87.73% 91.73%,
      72.85% 94.85%,
      54.69% 87.69%,
      46.76% 92.76%,
      26.98% 90.98%,
      6.26% 90.26%,
      0% 73.2%,
      0% 100%
    );
  }
</style>
