<script setup lang="ts">
  type Option = {
    label: string
    value: string | number
  }

  const props = defineProps<{
    id: string
    label?: string
    placeholder?: string
    validationKey?: keyof typeof validationRules
    options: Option[]
    modelValue?: string | number
  }>()

  const value = defineModel<string | number>()

  const error = ref<string | null>(null)

  const emit = defineEmits<{
    (e: 'update:error', value: string | null): void
  }>()

  function handleChange(event: Event) {
    const select = event.target as HTMLSelectElement
    const selectedValue = select.value
    value.value = selectedValue

    if (props.validationKey) {
      error.value = validateField(
        selectedValue,
        validationRules[props.validationKey]
      )
      emit('update:error', error.value)
    }
  }

  watch(value, (newValue) => {
    if (props.validationKey) {
      error.value = validateField(
        newValue?.toString() || '',
        validationRules[props.validationKey]
      )
      emit('update:error', error.value)
    }
  })

  // Background shapes logic
  const baseSelectSvg =
    '<svg viewBox="0 0 352 53" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M2.00004 30.5C2.00004 26.9 4.00003 9.16667 4.00003 0C7.33336 1.16667 14.7 3.5 17.5 3.5H113H169C202 3.5 201 0 240.5 0H351.5V43.5L321.5 49H220C191.5 49 202.5 49.5 191.5 49C180.5 48.5 172.5 51 134 46.5C95.5 42 2 43.5 2 43.5L2.00004 30.5Z" fill="white" /></svg>'

  function normalizePathWidth(pathData: string, targetWidth: number): string {
    const points = [...pathData.matchAll(/([MLC])\s*([\d.]+),([\d.]+)/g)]
    if (points.length === 0) return pathData

    const xValues = points.map(([, , x]) => parseFloat(x ?? '0'))
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const currentWidth = maxX - minX
    const scaleFactor = targetWidth / currentWidth

    return pathData.replace(/([\d.]+),([\d.]+)/g, (match, x, y) => {
      const scaledX = ((parseFloat(x) - minX) * scaleFactor).toFixed(2)
      const scaledY = (parseFloat(y) * scaleFactor).toFixed(2)
      return `${scaledX},${scaledY}`
    })
  }

  function generateRandomSvg() {
    const targetWidth = 352

    return baseSelectSvg.replace(
      /<path[^>]+d="([^"]+)"[^>]*>/g,
      (match, pathData) => {
        const randomizedPathData = pathData.replace(
          /(\d+(\.\d+)?)/g,
          (match: string) => {
            const num = parseFloat(match)
            const modified =
              num === 0 ? '0' : (num * (0.95 + Math.random() * 0.1)).toFixed(2)
            return modified
          }
        )

        const normalizedPathData = normalizePathWidth(
          randomizedPathData,
          targetWidth
        )

        return match.replace(pathData, normalizedPathData)
      }
    )
  }

  const randomSvg = ref(baseSelectSvg)

  onMounted(() => {
    const generated = generateRandomSvg()
    randomSvg.value = generated
  })

  const svgForeground = computed(() => {
    const encoded = randomSvg.value
      .replace(/\s+/g, ' ')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      .replace(/#/g, '%23')
      .replace(/"/g, '%22')
      .replace(/'/g, '%27')
    return `url("data:image/svg+xml,${encoded}")`
  })

  const svgBackground = computed(() => {
    return svgForeground.value.replace('white', 'black')
  })
</script>

<template>
  <label
    :for="id"
    class="select"
  >
    <span v-if="label">{{ label }}</span>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="value"
        :class="{ error }"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @change="handleChange"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          selected
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="svg-background">
        <div
          class="svg-layer foreground"
          :style="{ backgroundImage: svgForeground }"
        />
        <div
          class="svg-layer background"
          :style="{ backgroundImage: svgBackground }"
        />
      </div>
    </div>
    <div
      v-if="error"
      :id="`${id}-error`"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </div>
  </label>
</template>

<style scoped>
  .select {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    height: 100%;
  }

  .select-wrapper {
    position: relative;
    display: grid;
    width: 100%;
    height: 50px;
  }

  select {
    z-index: 2;
    box-sizing: border-box;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    padding: 10px 35px 10px 10px;
    font-family: var(--font-link);
    font-size: 1rem;
    color: var(--color-black);
    appearance: none;
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;
  }

  .svg-background {
    position: relative;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    .svg-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      &.foreground {
        z-index: -1;
      }

      &.background {
        z-index: -2;
        transform: translate(-5px, 5px);
      }
    }
  }

  .error-message {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--color-red);
  }

  select.error {
    color: var(--color-red);
  }

  /* Custom dropdown arrow */
  .select-wrapper::after {
    position: absolute;
    top: 50%;
    right: 15px;
    z-index: 3;
    width: 0;
    height: 0;
    pointer-events: none;
    content: '';
    border-top: 5px solid var(--color-black);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    transform: translateY(-50%);
  }

  select:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  select option {
    padding: 10px;
    color: var(--color-black);
    background-color: var(--color-white);

    &:checked {
      color: var(--color-white);
      background-color: var(--color-black);
    }
  }
</style>
