<script setup lang="ts">
  const props = defineProps<{
    id: string
    label?: string
    min: number
    max: number
    step?: number
  }>()

  const range = defineModel<[number, number]>({
    default: () => [0, 100], // Use static default, will be updated in onMounted
  })

  const step = computed(() => props.step || 1)

  // Computed properties for the input values
  const minValue = computed({
    get: () => range.value[0].toString(),
    set: (value: string) => {
      const newMin = parseInt(value) || props.min
      const currentMax = range.value[1]
      if (newMin <= currentMax) {
        range.value = [newMin, currentMax]
      }
    },
  })

  const maxValue = computed({
    get: () => range.value[1].toString(),
    set: (value: string) => {
      const newMax = parseInt(value) || props.max
      const currentMin = range.value[0]
      if (newMax >= currentMin) {
        range.value = [currentMin, newMax]
      }
    },
  })

  // Initialize with actual min/max values
  onMounted(() => {
    if (range.value[0] === 0 && range.value[1] === 100) {
      range.value = [props.min, props.max]
    }
  })

  function handleMinChange(event: Event) {
    const input = event.target as HTMLInputElement
    const newMin = parseInt(input.value)
    const currentMax = range.value[1]

    if (newMin <= currentMax) {
      range.value = [newMin, currentMax]
    }
  }

  function handleMaxChange(event: Event) {
    const input = event.target as HTMLInputElement
    const newMax = parseInt(input.value)
    const currentMin = range.value[0]

    if (newMax >= currentMin) {
      range.value = [currentMin, newMax]
    }
  }

  const minPercentage = computed(() => {
    return ((range.value[0] - props.min) / (props.max - props.min)) * 100
  })

  const maxPercentage = computed(() => {
    return ((range.value[1] - props.min) / (props.max - props.min)) * 100
  })

  const trackStyle = computed(() => {
    return {
      background: `linear-gradient(to right, 
        var(--color-grey-light) 0%, 
        var(--color-grey-light) ${minPercentage.value}%, 
        var(--color-mustard) ${minPercentage.value}%, 
        var(--color-mustard) ${maxPercentage.value}%, 
        var(--color-grey-light) ${maxPercentage.value}%, 
        var(--color-grey-light) 100%)`,
    }
  })

  const minThumbStyle = computed(() => ({
    left: `${minPercentage.value}%`,
  }))

  const maxThumbStyle = computed(() => ({
    left: `${maxPercentage.value}%`,
  }))
</script>

<template>
  <div class="range-slider-container">
    <div
      v-if="label"
      :for="`${id}-min`"
      class="range-label"
    >
      {{ label }}
    </div>

    <div class="range-inputs">
      <div class="range-input-group">
        <BaseInput
          :id="`${id}-min`"
          v-model="minValue"
          label="From"
          :placeholder="`${min}`"
          type="number"
        />
      </div>

      <div class="range-input-group">
        <BaseInput
          :id="`${id}-max`"
          v-model="maxValue"
          label="To"
          :placeholder="`${max}`"
          type="number"
        />
      </div>
    </div>

    <div class="slider-wrapper">
      <div class="slider-container">
        <div
          class="slider-track"
          :style="trackStyle"
        >
          <input
            :id="`${id}-min-slider`"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="range[0]"
            class="slider-thumb slider-thumb-min"
            :style="minThumbStyle"
            @input="handleMinChange"
          />
          <input
            :id="`${id}-max-slider`"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="range[1]"
            class="slider-thumb slider-thumb-max"
            :style="maxThumbStyle"
            @input="handleMaxChange"
          />
        </div>
      </div>
      <div class="range-values">
        <span>{{ range[0] }}</span>
        <span>{{ range[1] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .range-slider-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .range-label {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-black);
  }

  .range-inputs {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .range-input-group {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.25rem;
    max-width: 200px;

    input {
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem;
      font-family: var(--font-link);
      font-size: 0.9rem;
      color: var(--color-black);
      outline: none;
      background: var(--color-white);
      border: 1px solid var(--color-grey-light);
      border-radius: 0.25rem;

      &:focus {
        border-color: var(--color-mustard);
      }
    }
  }

  .slider-container {
    position: relative;
    width: 100%;
    height: 40px;
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-track {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 4px;
    background: var(--color-grey-light);
    border-radius: 2px;
    transform: translateY(-50%);
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    margin: 0;
    appearance: none;
    cursor: pointer;
    outline: none;
    background: var(--color-mustard);
    border: 2px solid var(--color-white);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    transform: translate(-50%, -50%);

    &:hover {
      background: var(--color-primary-dark);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgb(255 193 7 / 30%);
    }

    &::-webkit-slider-thumb {
      width: 20px;
      height: 20px;
      appearance: none;
      cursor: pointer;
      background: var(--color-mustard);
      border: 2px solid var(--color-white);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      cursor: pointer;
      background: var(--color-mustard);
      border: 2px solid var(--color-white);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    }
  }

  .slider-thumb-min {
    z-index: 2;
  }

  .slider-thumb-max {
    z-index: 1;
  }

  .range-values {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-link);
    font-size: 0.8rem;
    color: var(--color-text-light);
  }
</style>
