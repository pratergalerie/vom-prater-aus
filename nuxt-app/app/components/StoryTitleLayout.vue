<script setup lang="ts"></script>

<template>
  <div class="title-container">
    <div class="title">
      <slot name="title"></slot>
      <div class="info">
        <slot name="author"></slot>
        <slot name="year"></slot>
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

    & .title {
      container-type: inline-size;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      justify-content: center;
      padding: var(--space-2xl) var(--space-l);
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
    }

    .info {
      display: grid;
      grid-template-columns: minmax(300px, 4fr) minmax(100px, 1fr);
      gap: var(--space-xs);
      justify-content: space-between;

      @media (max-width: 500px) {
        display: flex;
        flex-direction: column;
      }
    }

    & .cutout {
      position: absolute;
      right: 20%;
      bottom: 0;
      width: 70%;
      height: 12%;
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
