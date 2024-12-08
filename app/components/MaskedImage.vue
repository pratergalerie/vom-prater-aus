<script setup lang="ts">
  defineProps<{
    imageSrc: string
    maskSrc?: string
    imageAlt: string
    useMaskAsTopShape?: boolean
    width: number
    height: number
  }>()

  const uniqueId = `mask-${Math.random().toString(36).substring(7)}`
</script>

<template>
  <div class="image-wrapper">
    <svg
      v-if="useMaskAsTopShape"
      :width="width"
      :height="height"
    >
      <mask :id="uniqueId">
        <image
          :href="maskSrc"
          x="0"
          y="0"
        ></image>
        <rect
          x="0"
          y="99"
          :width="width"
          :height="height"
          fill="white"
        ></rect>
      </mask>
      <rect
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="var(--mustard)"
        :mask="`url(#${uniqueId})`"
      ></rect>
      <image
        :href="imageSrc"
        :mask="`url(#${uniqueId})`"
        :alt="imageAlt"
        preserveAspectRatio="xMidYMid slice"
        class="tint"
      ></image>
    </svg>
    <div
      v-else
      class="image-wrapper"
    >
      <svg
        :id="uniqueId"
        :width="width"
        :height="height"
        :href="maskSrc"
      ></svg>
      <NuxtImg
        v-if="!useMaskAsTopShape"
        :src="imageSrc"
        :alt="imageAlt"
        :style="{ 'mask-image': `url(${uniqueId})` }"
      />
    </div>
  </div>
</template>

<style scoped>
  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  image {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: grayscale(100%);
  }

  .tint {
    mix-blend-mode: multiply;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
