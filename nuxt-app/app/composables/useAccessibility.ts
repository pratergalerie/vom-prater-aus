export const useAccessibility = () => {
  const largeFontEnabled = useState('largeFontEnabled', () => false)

  const applyFontSize = (enabled: boolean) => {
    if (import.meta.client) {
      document.documentElement.style.fontSize = enabled ? '125%' : '100%'
    }
  }

  const toggleLargeFont = (enabled: boolean) => {
    largeFontEnabled.value = enabled
    applyFontSize(enabled)

    if (import.meta.client) {
      localStorage.setItem('largeFontEnabled', enabled ? 'true' : 'false')
    }
  }

  // Initialize from localStorage
  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem('largeFontEnabled')
      if (saved === 'true') {
        largeFontEnabled.value = true
        applyFontSize(true)
      }
    })
  }

  return {
    largeFontEnabled,
    toggleLargeFont,
  }
}
