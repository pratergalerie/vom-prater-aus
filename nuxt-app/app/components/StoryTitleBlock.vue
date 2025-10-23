<script setup lang="ts">
  defineProps<{
    title: string
    authorName: string
    year: string
  }>()
</script>

<template>
  <div class="title-container">
    <div class="title">
      <h1>{{ title }}</h1>

      <div class="info">
        <span>
          {{ $t('pages.stories.story.memoryBy') + ' ' + authorName }}
        </span>
        <div class="year">
          <Icon name="mdi:calendar" />
          <span>{{ year }}</span>
        </div>
      </div>
    </div>
    <div class="cutout"></div>
  </div>
</template>

<style scoped>
  .title-container {
    position: relative;
    grid-row: 6 / 8;
    grid-column: 1 / 1;
    width: 100%;
    max-width: 600px;

    & .title {
      display: flex;
      flex-direction: column;
      gap: var(--space-3xs);
      justify-content: center;
      padding: var(--space-xl) var(--space-l);
      background-color: var(--color-mustard);
      clip-path: polygon(
        0% 10%,
        12.22% 5.3%,
        21.5% 10.87%,
        53.76% 8.25%,
        98.35% 0%,
        98.64% 76.25%,
        97.26% 89.26%,
        88.2% 82.2%,
        83.73% 91.73%,
        53.76% 93.76%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );

      & h1 {
        font-size: var(--step-2);
        text-wrap: inherit;
      }
    }

    .info {
      display: flex;
      gap: var(--space-xs);
      justify-content: space-between;

      & .year {
        display: flex;
        gap: var(--space-3xs);
        align-items: center;
      }
    }

    & .cutout {
      position: absolute;
      right: 20%;
      bottom: 0;
      width: 70%;
      height: 15%;
      background-color: var(--color-mint);
      clip-path: polygon(
        23% 2%,
        45% 0%,
        67% 4%,
        89% 2%,
        98% 15%,
        96% 38%,
        99% 52%,
        95% 71%,
        89% 85%,
        76% 92%,
        52% 98%,
        31% 95%,
        12% 89%,
        15% 12%
      );
    }
  }
</style>
