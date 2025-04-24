<script lang="ts" setup>
  import { useTresContext } from '@tresjs/core'
  import { Raycaster, Vector3, Vector2 } from 'three'
  import type { Texture, PerspectiveCamera } from 'three'
  import { Text3D, MapControls } from '@tresjs/cientos'

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

  defineProps<{ storyElements: StoryElement[] }>()

  const fontPath = '/fonts/Crimson-Pro-Italic.json'

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

  function isElementSelected(id: string) {
    return selectedElementId.value === id
  }

  const { scene, camera } = useTresContext()
  const raycaster = new Raycaster()
  const mouse = new Vector2()
  const selectedElementId = ref<string | null>(null)

  // Drag threshold logic to distinguish between dragging and clicking
  let isDragging = false
  let startX = 0
  let startY = 0
  const DRAG_THRESHOLD = 5

  onMounted(() => {
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  })

  onUnmounted(() => {
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  })

  function onPointerDown(event: PointerEvent) {
    isDragging = false
    startX = event.clientX
    startY = event.clientY
  }

  function onPointerMove(event: PointerEvent) {
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    const distSq = dx * dx + dy * dy

    if (distSq > DRAG_THRESHOLD * DRAG_THRESHOLD) {
      isDragging = true // It's a drag, not a click
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (isDragging) {
      // Let MapControls handle the drag
      return
    }

    // Convert mouse position to normalized device coordinates
    const canvas = event.target as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Ensure camera and scene are ready
    if (!camera.value || !scene.value) {
      console.error('Camera or Scene not available')
      return
    }

    // Raycasting setup
    raycaster.setFromCamera(mouse, camera.value)

    // Find intersected objects
    const intersects = raycaster.intersectObjects(scene.value.children, true)

    if (intersects.length > 0) {
      const intersectedObjectId = intersects[0]?.object.uuid

      if (intersectedObjectId) {
        focusElement(intersectedObjectId)
      }
    }
  }

  /**
   * Focus the camera on the given element by:
   * 1. Panning so the element is in the screen center
   * 2. Adjusting (zooming) camera Z to fit
   * 3. Animating over ~2 seconds
   */

  const cameraRef = ref<PerspectiveCamera | null>(null)

  const controlsRef = ref<typeof MapControls | null>(null)

  function focusElement(elementId: string) {
    const element = scene.value.children
      .at(0)
      ?.children.filter((child) => child.isObject3D)
      .filter((child) => child.type === 'Group')
      .find((child) => child.children[0]?.uuid === elementId)
      ?.children.at(0)

    if (!element) return

    // 1) Make sure both refs are set
    if (!cameraRef.value || !controlsRef.value) return

    const controls = controlsRef.value?.instance as typeof MapControls

    const startPos = cameraRef.value.position
    const startTarget = controls.target

    // 1) The real aspect ratio
    const aspect = window.innerWidth / window.innerHeight

    // 2) The element's Z
    const elemZ = element.position.z

    // 3) Calculate how far we want the camera
    const optimalZ = calculateOptimalZ(
      element.scale.x,
      element.scale.y,
      75, // camera FOV
      aspect,
      elemZ
    )

    const targetZ = Math.max(optimalZ, 500)

    const endPos = new Vector3(element.position.x, element.position.y, targetZ)
    const endTarget = new Vector3(
      element.position.x,
      element.position.y,
      element.position.z
    )

    const duration = 2000 // ms
    const startTime = performance.now()

    function step() {
      if (!controlsRef.value) return

      const now = performance.now()
      const t = Math.min((now - startTime) / duration, 1)

      // LERP camera position
      if (cameraRef.value) {
        cameraRef.value.position.x = lerp(startPos.x, endPos.x, t)
        cameraRef.value.position.y = lerp(startPos.y, endPos.y, t)
        cameraRef.value.position.z = lerp(startPos.z, endPos.z, t)
      }

      // LERP controls target
      controlsRef.value.instance.target.x = lerp(startTarget.x, endTarget.x, t)
      controlsRef.value.instance.target.y = lerp(startTarget.y, endTarget.y, t)
      controlsRef.value.instance.target.z = lerp(startTarget.z, endTarget.z, t)

      // Force controls to update
      controlsRef.value.instance.update()

      if (t < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  /**
   * Calculate how far the camera needs to be so that an object of size (width, height)
   * fully fits in the vertical or horizontal FOV of the camera, given the camera's aspect ratio.
   *
   * @param objectWidth   The object's bounding width
   * @param objectHeight  The object's bounding height
   * @param fov           The camera's vertical FOV, in degrees
   * @param aspectRatio   The camera's aspect ratio (width / height)
   * @param elementZ      The object's Z position
   * @returns number      The distance from the object (along camera's look direction)
   */
  function calculateOptimalZ(
    objectWidth: number,
    objectHeight: number,
    fov: number,
    aspectRatio: number,
    elementZ: number
  ) {
    const fovInRadians = (fov * Math.PI) / 180

    // Distance required so the height fits
    const distanceForHeight = objectHeight / (2 * Math.tan(fovInRadians / 2))

    // Distance required so the width fits (aspect ratio matters horizontally)
    const distanceForWidth =
      objectWidth / (2 * Math.tan(fovInRadians / 2) * aspectRatio)

    // Use the bigger of the two so both dimensions fit
    const requiredDistance = Math.max(distanceForHeight, distanceForWidth)

    return requiredDistance + elementZ + 2000 // Add some padding
  }

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }
</script>

<template>
  <TresGroup>
    <TresPerspectiveCamera
      ref="cameraRef"
      :position="[0, 10, 5000]"
      :near="1"
      :far="100000"
    />
    <MapControls
      ref="controlsRef"
      make-default
      :screen-space-panning="true"
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
        <TresMesh :position="element.position">
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
        >
          <TresMeshStandardMaterial color="black" />
        </Text3D>
      </Suspense>
    </TresGroup>
  </TresGroup>
</template>

<style></style>
