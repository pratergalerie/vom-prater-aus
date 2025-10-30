<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <div class="status-actions">
      <div
        v-if="$slots.formStatus"
        class="form-status"
      >
        <slot name="formStatus"></slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="background"></div>
  </div>
</template>

<style scoped>
  .wrapper {
    position: relative;
    bottom: 0;
    z-index: 700;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;

    & .status-actions {
      z-index: 3;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap-reverse;
      grid-area: stack;
      gap: var(--space-xs);
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      max-width: var(--max-width);
      padding: var(--space-2xs-xs) var(--space-xs);
      padding-bottom: var(--space-s);
      background-color: var(--color-beige);
      clip-path: polygon(
        0% 5%,
        21.5% 0%,
        53.76% 0%,
        100% 0%,
        99.8% 89.26%,
        88.2% 89.2%,
        83.73% 91.73%,
        70.85% 94.85%,
        63.69% 88.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );

      @media (max-width: 600px) {
        justify-content: center;
      }
    }

    & .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2xs);
      justify-content: center;
    }

    & .form-status {
      flex: 1 1 20ch;

      @media (max-width: 600px) {
        text-align: center;
      }
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
        0% 5%,
        21.5% 0%,
        53.76% 0%,
        100% 0%,
        99.8% 89.26%,
        88.2% 89.2%,
        83.73% 91.73%,
        70.85% 94.85%,
        63.69% 88.69%,
        53.76% 93.76%,
        26.98% 92.98%,
        1.26% 89.26%,
        0% 73.2%,
        0% 100%
      );
      transform: scaleX(1.005) scaleY(1.08);
    }
  }
</style>
