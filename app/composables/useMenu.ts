export const useMenu = () => {
  const isOpen = useState('opened', () => false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggleMenu,
  }
}
