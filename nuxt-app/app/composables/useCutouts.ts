import { computed } from 'vue'

export function useCutouts() {
  const images = import.meta.glob('~/assets/cutouts/*.png', {
    eager: true,
  })

  const cutoutFiles = computed(() => {
    return Object.entries(images)
      .map(([path, module]) => {
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
      .filter((file) => file.filename.endsWith('.png'))
  })

  return {
    cutoutFiles,
  }
}
