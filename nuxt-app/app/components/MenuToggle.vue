<script setup lang="ts">
  const { isOpen, toggleMenu } = useMenu()
  const isTransitioning = ref(false)

  function handleToggleMenu() {
    if (!isOpen.value) {
      isOpen.value = true
      isTransitioning.value = true
      setTimeout(() => {
        isTransitioning.value = false
      }, 1000)
    } else {
      isTransitioning.value = true
      setTimeout(() => {
        isTransitioning.value = false
        toggleMenu()
      }, 700)
    }
  }
</script>

<template>
  <button
    class="toggle-button"
    :class="{ blocked: isTransitioning }"
    aria-label="Toggle menu"
    tabindex="0"
    @click="handleToggleMenu"
  >
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
    right: var(--padding-mobile);
    bottom: var(--padding-mobile);
    z-index: 101;
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 0;
    pointer-events: all;
    cursor: pointer;
    background: none;
    background-image: url('/svgs/menu/button/to-open.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 0;

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

    &.blocked {
      pointer-events: none;
    }
  }
</style>
