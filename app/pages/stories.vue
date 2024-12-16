<script setup lang="ts">
  import { useLoader } from '@tresjs/core'
  import type { Texture } from 'three'
  import { Vector3, TextureLoader } from 'three'

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

  type ImageData = {
    texture: Texture
    position: [number, number, number]
    width: number
    height: number
  }

  const cameraPosition = ref(new Vector3(0, 10, 1000))
  const images = ref<ImageData[]>([])
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

  onMounted(() => {
    loadImageTextures()

    // Add mouse event listeners
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

  const moveFactor = 1
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
      cameraPosition.value.x -= deltaX * moveFactor
      cameraPosition.value.y += deltaY * moveFactor
    }

    // Update last mouse position
    lastMousePosition.x = event.clientX
    lastMousePosition.y = event.clientY
  }

  function onMouseUp() {
    isDragging.value = false
  }

  function onMouseWheel(event: WheelEvent) {
    console.log('Mouse wheel event:', event)
    // Scroll zoom: Adjust the camera's z-coordinate
    const zoom = event.deltaY > 0 ? zoomSpeed : -zoomSpeed

    cameraPosition.value = new Vector3(
      cameraPosition.value.x,
      cameraPosition.value.y,
      Math.max(500, Math.min(5000, cameraPosition.value.z + zoom))
    )
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
      const zoom = zoomDelta * 0.5
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
        cameraPosition.value.x - deltaX * moveFactor,
        cameraPosition.value.y + deltaY * moveFactor,
        cameraPosition.value.z
      )

      lastMousePosition.x = event.touches[0].clientX
      lastMousePosition.y = event.touches[0].clientY
    }
  }

  function onTouchEnd() {
    isDragging.value = false
  }

  async function loadImageTextures() {
    const imagePaths = [
      '/imgs/prater/prater1.jpeg',
      '/imgs/prater/prater2.jpeg',
      '/imgs/prater/prater3.jpeg',
      '/imgs/prater/prater4.jpeg',
      '/imgs/prater/prater5.jpeg',
      '/imgs/prater/prater6.jpeg',
      '/imgs/prater/prater7.jpeg',
      '/imgs/prater/prater8.jpeg',
      '/imgs/prater/prater9.jpeg',
      '/imgs/prater/prater10.jpeg',
    ]

    const distance = 4000
    const minSpacing = 100 // Minimum spacing between images

    // Function to check for overlap
    function isOverlapping(
      position: number[],
      width: number,
      height: number,
      existingImages: ImageData[]
    ) {
      return existingImages.some((image) => {
        if (!image.position || !position[0] || !position[1] || !position[2])
          return false
        const dx = position[0] - image.position[0]
        const dy = position[1] - image.position[1]
        const dz = position[2] - image.position[2]

        // Check for overlap in 3D space
        return (
          Math.abs(dx) < (width + image.width) / 2 + minSpacing &&
          Math.abs(dy) < (height + image.height) / 2 + minSpacing &&
          Math.abs(dz) < minSpacing
        )
      })
    }

    images.value = await Promise.all(
      imagePaths.map(async (path) => {
        // @ts-expect-error - Ignore type error
        const texture = await useLoader(TextureLoader, path)
        const [width, height] = await getImageResolution(path)

        let position = null
        const maxAttempts = 100 // Limit attempts to avoid infinite loops
        let attempts = 0

        do {
          position = [
            (Math.random() - 0.5) * distance, // Random X
            (Math.random() - 0.5) * distance, // Random Y
            (Math.random() - 0.5) * 80, // Random Z
          ]
          attempts++
        } while (
          attempts < maxAttempts &&
          isOverlapping(position, width, height, images.value)
        )

        if (attempts >= maxAttempts) {
          console.warn(
            `Could not place image ${path} without overlap after ${maxAttempts} attempts.`
          )
        }

        return {
          texture,
          position,
          width,
          height,
        } as ImageData
      })
    )
  }

  function onImageClick(imageSrc: string) {
    console.log('Image clicked:', imageSrc)
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
      />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight
        :intensity="0.7"
        :position="[10, 20, 10]"
      />

      <Suspense>
        <TresGroup
          v-for="(image, index) in images"
          :key="index"
        >
          <TresMesh
            :position="image.position"
            @click="() => onImageClick(image.texture.image.src)"
          >
            <TresPlaneGeometry :args="[image.width, image.height]" />
            <TresShaderMaterial
              :uniforms="{ map: { value: image.texture } }"
              :vertex-shader="grayscaleShader.vertexShader"
              :fragment-shader="grayscaleShader.fragmentShader"
            />
          </TresMesh>
        </TresGroup>
      </Suspense>
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
