<script setup lang="ts">
  const { isOpen, toggleMenu } = useMenu()

  function handleToggleMenu() {
    if (!isOpen.value) {
      isOpen.value = true
    } else {
      toggleMenu()
    }
  }
</script>

<template>
  <button
    class="toggle-button"
    aria-label="Toggle menu"
    tabindex="0"
    @click="handleToggleMenu"
  >
    <div
      class="button-background"
      :class="{ open: isOpen }"
    ></div>
    <div
      class="hamburger"
      :class="{ open: isOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>
</template>

<style scoped>
  .toggle-button {
    position: fixed;
    right: max(
      calc(50% - 500px + var(--padding-mobile)),
      var(--padding-mobile)
    );
    bottom: var(--padding-mobile);
    z-index: 101;
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 0;
    pointer-events: all;
    cursor: pointer;
    background: none;
    border: 0;

    .button-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/svgs/menu/toggle-button/button-shape.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transition: transform 0.3s ease;

      &.open {
        transform: rotate(180deg);
      }

      @media screen and (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    .hamburger {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      gap: 1px;
      justify-content: space-between;
      width: 15px;
      height: 15px;
      transform: translate(-50%, -50%);
      transition: transform 0.3s ease;

      @media screen and (min-width: 500px) {
        width: 20px;
        height: 15px;
      }

      span {
        width: 100%;
        height: 2px;
        background: var(--color-beige);
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;

        @media screen and (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      &.open {
        span {
          &:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          &:nth-child(3) {
            transform: translateY(-6px) rotate(-45deg);
          }
        }
      }

      @media screen and (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    @media screen and (min-width: 500px) {
      top: calc(var(--header-height) / 2 - 25px);
      right: max(
        calc(50% - 500px + var(--padding-tablet)),
        var(--padding-tablet)
      );
    }

    @media screen and (min-width: 768px) {
      right: max(
        calc(50% - 500px + var(--padding-desktop)),
        var(--padding-desktop)
      );
    }
  }
</style>
