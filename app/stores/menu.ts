export const useMenuStore = defineStore('menu', () => {
  const isOpen = ref(false)
  function toggleMenu() {
    isOpen.value = !isOpen.value
    console.log('Menu is open:', isOpen.value)
  }

  return { isOpen, toggleMenu }
})
