<script setup lang="ts">
  const props = defineProps<{
    /** @type String */
    type: 'primary' | 'secondary'
    variant: 'label' | 'icon' | 'icon-label'
    label: string
    icon?: string
  }>()
</script>

<template>
  <div>
    <button>{{ props.label }}</button>
  </div>
</template>

<style scoped></style>
