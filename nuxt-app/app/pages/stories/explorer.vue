<script setup lang="ts">
  import { useLoader } from '@tresjs/core'
  import type { Texture } from 'three'
  import { TextureLoader } from 'three'

  useHead({
    title: 'Vom Prater Aus - Stories',
    meta: [
      {
        name: 'description',
        content: 'Stories page',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
  })

  type StoryElement = {
    id: string
    image: Texture | null
    text: string | null
    textSize: number | null
    title: string
    author: string
    position: [number, number, number]
    width: number
    height: number
  }

  const { getStories } = useAPI()
  const storyElements = ref<StoryElement[]>([])

  const { data: stories } = await getStories()

  onMounted(async () => {
    if (stories.value) {
      loadStoryElementsContent()
    }
  })

  // Function to check for overlap
  function isOverlapping(
    position: [number, number, number],
    width: number,
    height: number,
    existingElements: StoryElement[]
  ): boolean {
    const buffer = 100 // Extra space to avoid overlaps

    return existingElements.some((element) => {
      const elementWidth = element.text
        ? element.width // Approximate text width
        : element.width // Use image width for images
      const elementHeight = element.text
        ? element.height // Approximate text height
        : element.height // Use image height for images

      const dx = Math.abs(position[0] - element.position[0])
      const dy = Math.abs(position[1] - element.position[1])

      // Check if bounding boxes overlap on X and Y
      return (
        dx < (width + elementWidth) / 2 + buffer && // Overlap in X
        dy < (height + elementHeight) / 2 + buffer // Overlap in Y
      )
    })
  }

  function breakTextIntoLines(text: string, maxLineLength: number): string {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      if ((currentLine + word).length <= maxLineLength) {
        currentLine += (currentLine ? ' ' : '') + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) lines.push(currentLine)

    return lines.join('\n') // Join lines with newline characters
  }

  async function loadStoryElementsContent() {
    if (!stories.value) return

    const distance = 4000 // Range for X and Y
    const maxAttempts = 100 // Avoid infinite loops

    for (const story of stories.value) {
      let texture: Texture
      let width: number
      let height: number

      if (Math.random() > 0.5 && story.featured_image) {
        // 50% chance to render an image
        // @ts-expect-error - TextureLoader type is not correct
        texture = await useLoader(TextureLoader, story.featured_image)
        ;[width, height] = await getImageResolution(story.featured_image)

        // Scale the image randomly between 1 and 2
        const scale = Math.random() + 1
        width *= scale
        height *= scale

        let position: [number, number, number] | null = null
        let attempts = 0

        // Attempt to place the story item without overlaps
        do {
          position = [
            (Math.random() - 0.5) * distance, // Random X
            (Math.random() - 0.5) * distance, // Random Y
            (Math.random() * distance) / 2, // Random Z
          ]
          attempts++
        } while (
          attempts < maxAttempts &&
          isOverlapping(position, width, height, storyElements.value)
        )

        if (attempts >= maxAttempts) {
          console.warn(
            `Could not place story ${story.title} without overlap after ${maxAttempts} attempts.`
          )
          continue // Skip this story if placement fails
        }

        // Add successfully placed story to the list
        storyElements.value.push({
          id: story.id,
          image: texture,
          font: null,
          text: null,
          textSize: null,
          title: story.title,
          author: story.author.name,
          position: position || [0, 0, 0],
          width,
          height,
        } as StoryElement)
      } else if (story.quote) {
        // Render text
        const maxLineLength = 40
        const text = breakTextIntoLines(story.quote, maxLineLength)

        const size = Math.floor(Math.random() * 50) + 50 // Random text size
        const width = size * maxLineLength * 0.5 // Approximate text width
        const height = size * text.split('\n').length // Text height based on lines

        let position: [number, number, number] | null = null
        let attempts = 0

        do {
          position = [
            (Math.random() - 0.5) * distance, // Random X
            (Math.random() - 0.5) * distance, // Random Y
            (Math.random() * distance) / 2, // Random Z
          ]
          attempts++
        } while (
          attempts < maxAttempts &&
          isOverlapping(position, width, height, storyElements.value)
        )

        if (attempts >= maxAttempts) {
          console.warn(
            `Could not place story ${story.title} without overlap after ${maxAttempts} attempts.`
          )
          continue
        }

        storyElements.value.push({
          id: story.id,
          image: null,
          text,
          textSize: size,
          title: story.title,
          author: story.author.name,
          position,
          width,
          height,
        } as StoryElement)
      }
    }
  }

  async function getImageResolution(
    imageSrc: string
  ): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      const image = new Image()

      // Handle image load
      image.onload = () => {
        resolve([image.width, image.height])
      }

      // Handle errors
      image.onerror = () => {
        reject(new Error(`Failed to load image at ${imageSrc}`))
      }

      // Set the source
      image.src = imageSrc
    })
  }
</script>

<template>
  <div class="scene-container">
    <TresCanvas window-size>
      <StoriesExplorer :story-elements="storyElements" />
    </TresCanvas>
  </div>
</template>

<style scoped>
  .scene-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mix-blend-mode: multiply;
  }
</style>
