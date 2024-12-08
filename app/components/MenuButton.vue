<script lang="ts" setup>
  const { isOpen } = storeToRefs(useMenuStore())
  const { toggleMenu } = useMenuStore()

  const buttonImgSrc = computed(() => {
    return isOpen.value ? '/icons/menu-close.svg' : '/icons/menu.svg'
  })
</script>

<template>
  <button @click="toggleMenu">
    <NuxtImg
      :src="buttonImgSrc"
      alt="Menu icon"
      class="icon"
    />
  </button>
</template>

<style scoped>
  button {
    position: fixed;
    right: var(--padding);
    bottom: var(--padding);
    z-index: 101;
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: none;
    border: 0;

    .icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>
