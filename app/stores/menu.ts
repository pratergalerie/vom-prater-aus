export const useMenuStore = defineStore('menu', () => {
  const isOpen = ref(false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, toggleMenu }
})
