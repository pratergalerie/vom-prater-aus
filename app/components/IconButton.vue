<script setup lang="ts">
  defineProps<{
    icon: string
    type: 'primary' | 'secondary'
  }>()
</script>

<template>
  <Icon
    name="mdi"
    :style="{ color: type === 'primary' ? 'black' : 'white' }"
    size="24px"
    mode="css"
  />
</template>

<style scoped>
  .icon {
    display: block;
  }
</style>
