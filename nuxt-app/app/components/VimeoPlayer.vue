<script setup lang="ts">
  import type Player from '@vimeo/player'

  const props = defineProps<{
    id: number
  }>()

  const video = ref<HTMLDivElement>()
  const { onLoaded } = useScriptVimeoPlayer()

  const player = ref<Player | null>(null)

  onLoaded(({ Vimeo }) => {
    player.value = new Vimeo.Player(video.value!, {
      id: props.id,
      responsive: true,
    })
  })
</script>

<template>
  <div
    ref="video"
    class="video-player"
  />
</template>

<style scoped>
  .video-player {
    position: relative;
    z-index: 1500;
    width: 100%;
    min-width: 300px;
  }
</style>
