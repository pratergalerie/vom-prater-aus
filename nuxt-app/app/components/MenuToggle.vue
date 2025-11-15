<script setup lang="ts">
  const { isOpen, toggleMenu, toggleButtonRef } = useMenu()
  const buttonRef = ref<HTMLButtonElement>()

  onMounted(() => {
    toggleButtonRef.value = buttonRef.value || null
  })

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
    ref="buttonRef"
    aria-label="Menu"
    :aria-expanded="isOpen"
    @click="handleToggleMenu"
  >
    <div
      class="background"
      :class="{ open: isOpen }"
    ></div>
    <div
      class="hamburger"
      :class="{ open: isOpen }"
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  </button>
</template>

<style scoped>
  button {
    display: grid;
    grid-template-areas: 'stack';
    place-items: center;
    width: 50px;
    height: 50px;
    padding: 0;
    appearance: none;
    cursor: pointer;
    background: unset;
    border: unset;

    .background {
      grid-area: stack;
      width: 100%;
      height: 100%;
      background-image: url('/svgs/menu/toggle-button/button-shape.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transition: transform 0.5s ease;

      &.open {
        transform: rotate(180deg);
      }

      @media screen and (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    .hamburger {
      z-index: 2;
      display: flex;
      flex-direction: column;
      grid-area: stack;
      justify-content: space-between;
      width: 40%;
      height: 30%;
      transition: transform 0.3s ease;

      div {
        width: 100%;
        height: 2px;
        background: var(--color-beige);
        transition:
          transform 0.3s ease,
          opacity 0.1s ease;

        @media screen and (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      &.open {
        div {
          &:nth-child(1) {
            transform: translateY(300%) rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          &:nth-child(3) {
            transform: translateY(-300%) rotate(-45deg);
          }
        }
      }

      @media screen and (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }
</style>
