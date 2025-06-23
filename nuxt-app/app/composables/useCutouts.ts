import { computed } from 'vue'

export function useCutouts() {
  const images = import.meta.glob('~/assets/svgs/cutouts/*.svg', {
    eager: true,
  })

  const cutoutFiles = computed(() => {
    const files = Object.entries(images)
      .map(([path, module]) => {
        // Extract filename from full path (e.g., "/src/assets/svgs/cutouts/1.svg" -> "1.svg")
        const filename = path.split('/').pop() || ''

        // Get the processed asset URL from the module
        const assetUrl =
          (module as { default?: string } & string).default ||
          (module as string)

        return {
          filename,
          url: assetUrl,
        }
      })
      .filter((file) => file.filename.endsWith('.svg'))

    // Sort files numerically if they have numeric names
    return files.sort((a, b) => {
      const numA = parseInt(a.filename.replace('.svg', ''))
      const numB = parseInt(b.filename.replace('.svg', ''))
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.filename.localeCompare(b.filename)
    })
  })

  return {
    cutoutFiles,
  }
}
