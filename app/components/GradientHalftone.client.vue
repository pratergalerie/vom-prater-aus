<script lang="ts" setup>
  type Direction = 'top' | 'bottom'

  const props = defineProps({
    direction: {
      type: String as PropType<Direction>,
      default: 'top',
    },
    fadeToColor: {
      type: String,
      default: 'var(--light-beige)',
    },
    height: {
      type: Number,
      default: 100,
    },
  })

  const backgroundGradient = computed(() => {
    return props.direction === 'top'
      ? `linear-gradient(180deg, ${props.fadeToColor}, transparent)`
      : `linear-gradient(0deg, ${props.fadeToColor}, transparent)`
  })

  const blurMask = computed(() => {
    return props.direction === 'top'
      ? 'linear-gradient(0deg, transparent, black 30%)'
      : 'linear-gradient(180deg, transparent, black 30%)'
  })

  const width = computed(() => {
    if (window) {
      return window.innerWidth
    } else return 500
  })

  const widthPx = computed(() => {
    return `${width.value}px`
  })

  const heightPx = computed(() => {
    return `${props.height}px`
  })
</script>

<template>
  <div
    class="gradient-halftone-container"
    :class="direction === 'top' ? 'top-gradient' : 'bottom-gradient'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      class="halftone"
      :class="{ inverted: direction === 'bottom' }"
    >
      <defs>
        <pattern
          id="halftone"
          x="0"
          y="0"
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1"
            cy="1"
            r="2"
            :fill="fadeToColor"
          />
        </pattern>
        <mask id="gradientMask">
          <rect
            x="0"
            y="0"
            :width="width"
            height="100"
            fill="url(#gradient)"
          />
        </mask>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="white"
          />
          <stop
            offset="100%"
            stop-color="black"
          />
        </linearGradient>
        <linearGradient
          id="circleGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            :stop-color="fadeToColor"
            stop-opacity="1"
          />
          <stop
            offset="100%"
            :stop-color="fadeToColor"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="url(#halftone)"
        mask="url(#gradientMask)"
      />
    </svg>
    <div class="blur-mask"></div>
  </div>
</template>

<style scoped>
  .gradient-halftone-container {
    position: absolute;
    width: v-bind(widthPx);
    height: v-bind(heightPx);
    background: v-bind(backgroundGradient);
  }

  .top-gradient {
    top: 0;
    left: 0;
  }

  .bottom-gradient {
    bottom: 0;
    left: 0;
  }

  .blur-mask {
    position: absolute;
    inset: 0%;
    z-index: -2;
    backdrop-filter: blur(2px);
    mask: v-bind(blurMask);
  }

  .halftone {
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 1;

    &.inverted {
      transform: rotate(180deg);
    }
  }
</style>
