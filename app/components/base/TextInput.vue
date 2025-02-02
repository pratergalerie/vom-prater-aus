<script lang="ts" setup>
  enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
  }

  defineProps<{
    id: string
    type: InputType
    label?: string
    placeholder?: string
  }>()

  const value = defineModel({
    type: String,
    default: '',
  })

  const baseTextInputSvg =
    '<svg viewBox="0 0 352 53" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M2.00004 30.5C2.00004 26.9 4.00003 9.16667 4.00003 0C7.33336 1.16667 14.7 3.5 17.5 3.5H113H169C202 3.5 201 0 240.5 0H351.5V43.5L321.5 49H220C191.5 49 202.5 49.5 191.5 49C180.5 48.5 172.5 51 134 46.5C95.5 42 2 43.5 2 43.5L2.00004 30.5Z" fill="white" /></svg>'

  function normalizePathWidth(pathData: string, targetWidth: number): string {
    // Extract all x-coordinates (assuming the path data is in the format of SVG commands)
    const points = [...pathData.matchAll(/([MLC])\s*([\d.]+),([\d.]+)/g)]
    if (points.length === 0) return pathData // No points found, return as is

    // Get the min and max x-values
    const xValues = points.map(([, , x]) => parseFloat(x ?? '0'))
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const currentWidth = maxX - minX

    // Calculate the scaling factor
    const scaleFactor = targetWidth / currentWidth

    // Apply the scaling factor to all x and y values
    return pathData.replace(/([\d.]+),([\d.]+)/g, (match, x, y) => {
      const scaledX = ((parseFloat(x) - minX) * scaleFactor).toFixed(2)
      const scaledY = (parseFloat(y) * scaleFactor).toFixed(2) // Optional: scale Y for uniformity
      return `${scaledX},${scaledY}`
    })
  }

  function generateRandomSvg() {
    const targetWidth = 352 // Width of the original SVG

    return baseTextInputSvg.replace(
      /<path[^>]+d="([^"]+)"[^>]*>/g,
      (match, pathData) => {
        // Modify the `d` attribute (pathData)
        const randomizedPathData = pathData.replace(
          /(\d+(\.\d+)?)/g,
          (match: string) => {
            const num = parseFloat(match)
            const modified =
              num === 0 ? '0' : (num * (0.95 + Math.random() * 0.1)).toFixed(2)
            return modified
          }
        )

        // Normalize the width of the randomized path
        const normalizedPathData = normalizePathWidth(
          randomizedPathData,
          targetWidth
        )

        // Return the modified `<path>` element
        return match.replace(pathData, normalizedPathData)
      }
    )
  }

  const randomSvg = ref(baseTextInputSvg)

  onMounted(() => {
    const generated = generateRandomSvg()
    randomSvg.value = generated
  })

  const svgForeground = computed(() => {
    const encoded = randomSvg.value
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/</g, '%3C') // Encode <
      .replace(/>/g, '%3E') // Encode >
      .replace(/#/g, '%23') // Encode #
      .replace(/"/g, '%22') // Encode "
      .replace(/'/g, '%27') // Encode '
    return `url("data:image/svg+xml,${encoded}")`
  })

  // Generate a copy of the svgForeground value, but with color black
  const svgBackground = computed(() => {
    return svgForeground.value.replace('white', 'black')
  })
</script>

<template>
  <label :for="id">
    <span v-if="label">{{ label }}</span>
    <input
      :id="id"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
    />
    <div
      class="svg-layer text-input foreground"
      :style="{ backgroundImage: svgForeground }"
    />
    <div
      class="svg-layer text-input background"
      :style="{ backgroundImage: svgBackground }"
    />
  </label>
</template>

<style scoped>
  label {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    height: 100%;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    font-family: var(--link-font);
    font-size: 1rem;
    outline: none;
    background: transparent;
    border: none;
  }

  .svg-layer {
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    &.text-input {
      top: 25px;
      left: -5px;
      width: 100%;
      height: 50px;
    }

    &.foreground {
      z-index: -1;
    }

    &.background {
      z-index: -2;
      transform: translate(-5px, 5px);
    }
  }
</style>
