<script lang="ts" setup>
  defineProps<{
    id: string
    label?: string
    disabled?: boolean
  }>()

  const checked = defineModel('checked', {
    type: Boolean,
    default: false,
  })
</script>

<template>
  <label
    :for="id"
    :class="{ disabled }"
  >
    <input
      :id="id"
      v-model="checked"
      type="checkbox"
      :disabled="disabled"
    />
    <div class="svg-layer checkbox">
      <img
        src="/svgs/inputs/checkbox.svg"
        alt="checkbox"
        class="background"
      />
      <img
        v-if="checked"
        src="/svgs/inputs/check.png"
        alt="checked"
        class="foreground"
      />
    </div>
    <span v-if="label">{{ label }}</span>
  </label>
</template>

<style scoped>
  label {
    position: relative;
    display: flex;
    gap: 5px;
    height: 1rem;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;

      & .svg-layer img {
        filter: grayscale(100%);
      }
    }
  }

  input {
    z-index: 1;
    box-sizing: border-box;
    width: 1rem;
    height: 1rem;
    padding: 10px;
    font-family: var(--link-font);
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;
    opacity: 0;
  }

  .svg-layer {
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    &.checkbox {
      top: 0;
      left: 0;
      display: grid;
      width: 20px;
      height: 20px;

      /* stylelint-disable-next-line no-descending-specificity */
      img {
        width: 100%;
        height: 100%;
      }

      .background,
      .foreground {
        grid-area: 1/1;
      }

      .background {
        z-index: -2;
      }

      .foreground {
        z-index: -1;
        transform: translate(5px, -5px);
      }
    }

    &.foreground {
      z-index: -1;
    }

    &.background {
      z-index: -2;
      transform: translate(-5px, 5px);
    }
  }

  span {
    font-family: var(--link-font);
    font-size: 0.8rem;
  }
</style>
