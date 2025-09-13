<script setup lang="ts">
  const props = defineProps<{
    listIcon: string
    explorerIcon: string
    listLabel: string
    explorerLabel: string
    disabled?: boolean
  }>()

  const mode = defineModel<'list' | 'explorer'>('mode', { required: true })

  function handleToggle() {
    if (!props.disabled) {
      mode.value = mode.value === 'list' ? 'explorer' : 'list'
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }
</script>

<template>
  <div class="toggle-container">
    <div
      class="toggle-switch"
      :class="{
        'toggle-active': mode === 'explorer',
        'toggle-disabled': disabled,
      }"
      role="switch"
      :aria-checked="mode === 'explorer'"
      :aria-label="`Switch to ${mode === 'explorer' ? listLabel : explorerLabel} view`"
      tabindex="0"
      @click="handleToggle"
      @keydown="handleKeyDown"
    >
      <div class="toggle-track">
        <div class="toggle-thumb">
          <Icon
            :name="mode === 'list' ? listIcon : explorerIcon"
            class="toggle-icon"
          />
        </div>
      </div>
      <div class="toggle-icons">
        <div
          class="toggle-icon toggle-icon-left"
          :class="{ 'toggle-icon-visible': mode === 'explorer' }"
        >
          <Icon :name="listIcon" />
        </div>
        <div
          class="toggle-icon toggle-icon-right"
          :class="{ 'toggle-icon-visible': mode === 'list' }"
        >
          <Icon :name="explorerIcon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .toggle-container {
    display: flex;
    align-items: center;
  }

  .toggle-switch {
    position: relative;
    width: 80px;
    height: 40px;
    cursor: pointer;
    user-select: none;
    background: url('svgs/ui/toggle/base.webp') no-repeat center center;
    background-size: 100% 100%;
    transition: all 0.3s ease;

    @media screen and (prefers-reduced-motion: reduce) {
      position: relative;
      cursor: pointer;
      user-select: none;
      transition: none;
    }

    &.toggle-disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .toggle-track {
    position: absolute;
    top: 2px;
    left: 5px;
    width: 70px;
    height: 35px;
    outline: none;
    background: transparent;
    border: none;
    transition: all 0.3s ease;

    @media screen and (prefers-reduced-motion: reduce) {
      position: relative;
      width: 70px;
      height: 35px;
      background: transparent;
      transition: none;
    }
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    outline: none;
    background: url('svgs/ui/toggle/thumb.svg') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    transition: all 0.3s ease;

    @media screen and (prefers-reduced-motion: reduce) {
      position: absolute;
      top: 2px;
      left: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      transition: none;
    }

    .toggle-switch.toggle-active & {
      transform: translateX(40px);
    }
  }

  .toggle-icon {
    width: 16px;
    height: 16px;
    color: var(--color-white);
  }

  .toggle-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);

    .toggle-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 90%;
      color: var(--color-grey);
      opacity: 0;
      transition: opacity 0.3s ease;

      &.toggle-icon-left {
        grid-column: 1;
      }

      &.toggle-icon-right {
        grid-column: 2;
      }

      &.toggle-icon-visible {
        opacity: 0.5;
      }

      @media screen and (prefers-reduced-motion: reduce) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        color: var(--color-grey);
        opacity: 0;
        transition: none;

        &.toggle-icon-left {
          grid-column: 1;
        }

        &.toggle-icon-right {
          grid-column: 2;
        }

        &.toggle-icon-visible {
          opacity: 0.5;
        }
      }
    }
  }
</style>
