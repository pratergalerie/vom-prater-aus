<script setup lang="ts">
  import type Player from '@vimeo/player'

  const props = defineProps<{
    id: number
  }>()

  const video = ref<HTMLDivElement>()
  const { onLoaded } = useScriptVimeoPlayer()

  const player = ref<Player | null>(null)
  const isLoading = ref(true)
  const isMounted = ref(false)

  interface VimeoLibrary {
    Player: new (
      element: HTMLElement,
      options?: { id: number; responsive: boolean }
    ) => Player
  }

  const initPlayer = (Vimeo: VimeoLibrary) => {
    nextTick(() => {
      if (!video.value) return

      player.value = new Vimeo.Player(video.value, {
        id: props.id,
        responsive: true,
      })

      if (player.value) {
        player.value
          .ready()
          .then(() => {
            isLoading.value = false
          })
          .catch(() => {
            isLoading.value = false
          })
      }
    })
  }

  let vimeoLib: VimeoLibrary | null = null

  onLoaded(({ Vimeo }) => {
    vimeoLib = Vimeo
    if (isMounted.value) {
      initPlayer(Vimeo)
    }
  })

  onMounted(() => {
    isMounted.value = true
    if (vimeoLib) {
      initPlayer(vimeoLib)
    }
  })
</script>

<template>
  <div
    class="video-container"
    :class="{ 'is-loading': isLoading }"
  >
    <div
      v-if="isMounted"
      ref="video"
      class="video-player"
    />
  </div>
</template>

<style scoped>
  .video-container {
    position: relative;
    width: 100%;
    min-width: 300px;
    aspect-ratio: 16/9;

    &.is-loading {
      background: linear-gradient(
        90deg,
        var(--color-grey-lightest) 25%,
        var(--color-grey-light) 50%,
        var(--color-grey-lightest) 75%
      );
      background-size: 200% 100%;
      animation: loading 4s ease-in-out infinite;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }
  }

  .video-player {
    position: relative;
    z-index: 500;
    width: 100%;
    height: 100%;
  }

  @keyframes loading {
    from {
      background-position: 200% 0;
    }

    to {
      background-position: -200% 0;
    }
  }
</style>
