<script setup lang="ts">
  import { useLoader } from '@tresjs/core'
  import type { Texture } from 'three'
  import { Vector3, TextureLoader } from 'three'
  import { Text3D } from '@tresjs/cientos'

  import data from '~/data/stories.json'

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

  type Story = {
    id: number
    title: string
    image: string
    author: string
    date: string
    excerpt: string
  }

  type StoryElement = {
    id: number
    image: Texture | null
    text: string | null
    textSize: number | null
    title: string
    author: string
    position: [number, number, number]
    width: number
    height: number
  }

  const storiesData = ref<Story[]>(data.stories)

  const cameraPosition = ref(new Vector3(0, 10, 5000))
  const storyElements = ref<StoryElement[]>([])
  const isDragging = ref(false)
  const lastMousePosition = reactive({ x: 0, y: 0 })

  const canvasRef = ref<HTMLElement | null>(null)

  const grayscaleShader = {
    uniforms: {
      map: { value: null },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D map;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(map, vUv);
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114)); // Standard grayscale formula
      gl_FragColor = vec4(vec3(gray), color.a);
    }
  `,
  }

  onMounted(async () => {
    loadStoryElementContent()

    if (canvasRef.value) {
      canvasRef.value.addEventListener('mousedown', onMouseDown)
      canvasRef.value.addEventListener('mousemove', onMouseMove)
      canvasRef.value.addEventListener('mouseup', onMouseUp)
      canvasRef.value.addEventListener('wheel', onMouseWheel)
      canvasRef.value.addEventListener('touchstart', onTouchStart)
      canvasRef.value.addEventListener('touchmove', onTouchMove)
      canvasRef.value.addEventListener('touchend', onTouchEnd)
    }
  })

  const moveFactor = computed(() => {
    return cameraPosition.value.z / 1000
  })
  const zoomSpeed = 50 // Adjust zoom sensitivity
  let previousPinchDistance = 0

  function onMouseDown(event: MouseEvent) {
    isDragging.value = true
    lastMousePosition.x = event.clientX
    lastMousePosition.y = event.clientY
  }

  function onMouseMove(event: MouseEvent) {
    if (!isDragging.value) return

    const deltaX = event.clientX - lastMousePosition.x
    const deltaY = event.clientY - lastMousePosition.y

    // Update the camera position based on the delta
    if (
      cameraPosition.value &&
      cameraPosition.value.x &&
      cameraPosition.value.y
    ) {
      cameraPosition.value.x -= deltaX * moveFactor.value
      cameraPosition.value.y += deltaY * moveFactor.value
    }

    // Update last mouse position
    lastMousePosition.x = event.clientX
    lastMousePosition.y = event.clientY
  }

  function onMouseUp() {
    isDragging.value = false
  }

  function onMouseWheel(event: WheelEvent) {
    const zoom = event.deltaY > 0 ? zoomSpeed : -zoomSpeed

    cameraPosition.value = new Vector3(
      cameraPosition.value.x,
      cameraPosition.value.y,
      Math.max(500, Math.min(5000, cameraPosition.value.z + zoom))
    )

    // Unselect the element if zoomed far enough
    if (cameraPosition.value.z > 1500) {
      unselectElement()
    }
  }

  function onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
      // Two-finger touch: Initialize pinch distance
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      previousPinchDistance = Math.sqrt(dx * dx + dy * dy)
    } else if (event.touches.length === 1 && event.touches[0]) {
      // Single-finger touch: Initialize drag
      isDragging.value = true
      lastMousePosition.x = event.touches[0].clientX
      lastMousePosition.y = event.touches[0].clientY
    }
  }

  function onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
      // Pinch zoom
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      const currentPinchDistance = Math.sqrt(dx * dx + dy * dy)

      // Calculate zoom delta
      const zoomDelta = currentPinchDistance - previousPinchDistance
      const zoom = zoomDelta * 3
      cameraPosition.value = new Vector3(
        cameraPosition.value.x,
        cameraPosition.value.y,
        Math.max(500, Math.min(5000, cameraPosition.value.z + zoom))
      )
      previousPinchDistance = currentPinchDistance
    } else if (event.touches.length === 1 && event.touches[0]) {
      // Drag camera
      const deltaX = event.touches[0].clientX - lastMousePosition.x
      const deltaY = event.touches[0].clientY - lastMousePosition.y

      cameraPosition.value = new Vector3(
        cameraPosition.value.x - deltaX * moveFactor.value,
        cameraPosition.value.y + deltaY * moveFactor.value,
        cameraPosition.value.z
      )

      lastMousePosition.x = event.touches[0].clientX
      lastMousePosition.y = event.touches[0].clientY
    }

    // Unselect the element if zoomed far enough
    if (cameraPosition.value.z > 1500) {
      unselectElement()
    }
  }

  function onTouchEnd() {
    isDragging.value = false
  }

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

  async function loadStoryElementContent() {
    const distance = 4000 // Range for X and Y
    const maxAttempts = 100 // Avoid infinite loops

    for (const story of storiesData.value) {
      let texture: Texture
      let width: number
      let height: number

      if (Math.random() > 0.5) {
        // 50% chance to render an image
        // @ts-expect-error - TextureLoader type is not correct
        texture = await useLoader(TextureLoader, story.image)
        ;[width, height] = await getImageResolution(story.image)

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
          author: story.author,
          position: position || [0, 0, 0],
          width,
          height,
        } as StoryElement)
      } else {
        // Render text
        const maxLineLength = 40
        const text = breakTextIntoLines(story.excerpt, maxLineLength)

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
          author: story.author,
          position,
          width,
          height,
        } as StoryElement)
      }
    }
  }

  const fontPath = '/fonts/Crimson-Pro-Italic.json'

  function onElementClick(elementId: number) {
    const clickedElement = storyElements.value.find((el) => el.id === elementId)
    if (!clickedElement) return

    const targetPosition = clickedElement.position

    // Aspect ratio of the scene
    const aspectRatio = window.innerWidth / window.innerHeight

    // Calculate the optimal Z position based on width, height, and element Z position
    const optimalZ = calculateOptimalZ(
      clickedElement.width,
      clickedElement.height,
      75, // FOV
      aspectRatio,
      targetPosition[2] // Element's Z position
    )

    const targetZ = Math.max(optimalZ, 500) // Ensure Z doesn't go below 500

    // Smooth camera transition
    animateCamera(new Vector3(targetPosition[0], targetPosition[1], targetZ))

    // Highlight the selected element
    selectElement(elementId)
  }

  function animateCamera(targetPosition: Vector3) {
    // Animate
    const animationDuration = 2000
    const start = performance.now()
    const end = start + animationDuration

    function step() {
      const now = performance.now()
      const progress = Math.min((now - start) / animationDuration, 1)

      // Update camera position
      cameraPosition.value = new Vector3(
        lerp(cameraPosition.value.x, targetPosition.x, progress),
        lerp(cameraPosition.value.y, targetPosition.y, progress),
        lerp(cameraPosition.value.z, targetPosition.z, progress)
      )

      if (now < end) {
        requestAnimationFrame(step)
      }
    }

    step()

    function lerp(start: number, end: number, progress: number) {
      return start + (end - start) * progress
    }
  }

  function calculateOptimalZ(
    objectWidth: number,
    objectHeight: number,
    fov: number,
    aspectRatio: number,
    elementZ: number
  ): number {
    // Convert FOV to radians
    const fovInRadians = (fov * Math.PI) / 180

    // Calculate distance required to fit the element's height
    const distanceForHeight = objectHeight / (2 * Math.tan(fovInRadians / 2))

    // Calculate distance required to fit the element's width (consider aspect ratio)
    const distanceForWidth =
      objectWidth / (2 * Math.tan(fovInRadians / 2) * aspectRatio)

    // Use the larger distance to ensure the entire element is visible
    const requiredDistance = Math.max(distanceForHeight, distanceForWidth)

    // Adjust for the element's Z position
    return requiredDistance + elementZ
  }

  const selectedElementId = ref<number | null>(null)
  function selectElement(elementId: number) {
    // Highlight the selected element
    console.log('Selected element:', elementId)
    selectedElementId.value = elementId
  }

  function unselectElement() {
    if (selectedElementId.value !== null) {
      console.log('Unselected element:', selectedElementId.value)
      selectedElementId.value = null
    }
  }

  function isElementSelected(elementId: number) {
    return selectedElementId.value === elementId
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onCameraUpdate() {
    // Handle any updates to the camera, such as saving the position if needed
  }
</script>

<template>
  <div
    ref="canvasRef"
    class="scene-container"
  >
    <TresCanvas window-size>
      <TresPerspectiveCamera
        :fov="75"
        :position="cameraPosition"
        :near="1"
        :far="10000"
      />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight
        :intensity="0.7"
        :position="[10, 20, 10]"
      />

      <TresGroup
        v-for="(element, index) in storyElements"
        :key="index"
      >
        <Suspense v-if="element.image">
          <TresMesh
            :position="element.position"
            @click="() => onElementClick(element.id)"
          >
            <TresPlaneGeometry :args="[element.width, element.height]" />
            <TresMeshBasicMaterial
              v-if="isElementSelected(element.id)"
              :map="element.image"
            />
            <TresShaderMaterial
              v-else
              :uniforms="{ map: { value: element.image } }"
              :vertex-shader="grayscaleShader.vertexShader"
              :fragment-shader="grayscaleShader.fragmentShader"
            />
          </TresMesh>
        </Suspense>
        <Suspense v-else-if="element.text">
          <Text3D
            :font="fontPath"
            :text="element.text"
            :size="element.textSize || 50"
            :position="element.position"
            :color="0xffffff"
            @click="() => onElementClick(element.id)"
          >
            <TresMeshStandardMaterial color="black" />
          </Text3D>
        </Suspense>
      </TresGroup>
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
