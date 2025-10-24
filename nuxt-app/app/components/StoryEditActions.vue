<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <div class="actions">
      <slot name="actions"></slot>
    </div>
    <div class="background"></div>
  </div>
</template>

<style scoped>
  .wrapper {
    position: relative;
    bottom: 0;
    z-index: 1000;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;

    & .actions {
      z-index: 3;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      max-width: var(--max-width);
      padding: var(--space-m) var(--space-l);
      padding-bottom: var(--space-l);
      background-color: var(--color-beige);
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
        70.85% 94.85%,
        63.69% 88.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );
    }

    & .background {
      position: absolute;
      top: 2px;
      z-index: 1;
      grid-area: stack;
      width: 100%;
      height: 100%;
      background-color: var(--color-grey-light);
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
        70.85% 94.85%,
        63.69% 88.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );
      transform: scaleX(1.01) scaleY(1.06);
    }
  }
</style>
