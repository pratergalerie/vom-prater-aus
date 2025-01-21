<script setup lang="ts">
  const illustrationImage = ref<string>('')
  const figureTopShape = '/svgs/menu/shapes/background/mustard/1.svg'

  const {
    locale: currentLocale,
    locales,
    setLocale,
  } = useI18n({ useScope: 'global' })

  const { isOpen, toggleMenu, menuRoutes } = useMenu()
  const buttonImgSrc = computed(() => {
    return isOpen.value
      ? '/svgs/menu/button/to-close.svg'
      : '/svgs/menu/button/to-open.svg'
  })

  function chooseRandomMenuImage() {
    const randomImage = Math.floor(Math.random() * 10) + 1
    illustrationImage.value = `/imgs/prater/prater${randomImage}.jpeg`
  }

  const menuTransitionTime = 500
  const closingMenu = ref(false)
  const revealIllustration = ref(false)
  const isTransitioning = ref(false)

  function handleToggleMenu() {
    if (!isOpen.value) {
      isOpen.value = true
      isTransitioning.value = true
      setTimeout(() => {
        isTransitioning.value = false
      }, 1000)
    } else {
      closingMenu.value = true
      revealIllustration.value = false
      isTransitioning.value = true
      setTimeout(() => {
        isTransitioning.value = false
        closingMenu.value = false
        toggleMenu()
      }, 700)
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      await nextTick()
      setTimeout(() => {
        revealIllustration.value = true
      }, 1000)
      chooseRandomMenuImage()
    }
  })

  function generateIrregularClipPath(progress: number): string {
    const irregularities = Array.from(
      { length: 5 },
      () => Math.random() * 10 - 5
    ) // Random offsets
    const left = 0 // Start from the left edge
    const right = progress * 100 // Progressively reveal the right edge
    return `polygon(
    ${left}% 0%,
    ${right + (irregularities[0] || 0)}% 0%,
    ${right + (irregularities[1] || 0)}% 25%,
    ${right + (irregularities[2] || 0)}% 50%,
    ${right + (irregularities[3] || 0)}% 75%,
    ${right}% 100%,
    ${left}% 100%
  )`
  }

  const clipPath = ref('polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)')

  watch(revealIllustration, (reveal) => {
    if (reveal) {
      isTransitioning.value = true
      let progress = 0

      const interval = setInterval(() => {
        progress += 0.15 // Adjust speed
        if (progress >= 1) {
          progress = 1
          // Fully revealed state
          clipPath.value = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          clearInterval(interval)
          isTransitioning.value = false
        } else {
          clipPath.value = generateIrregularClipPath(progress)
        }
      }, 75) // Adjust interval for smoothness
    } else {
      isTransitioning.value = true
      let progress = 1

      const interval = setInterval(() => {
        progress -= 0.2 // Reverse the progress
        if (progress <= 0) {
          progress = 0
          clipPath.value = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' // Fully hidden state
          clearInterval(interval)
          isTransitioning.value = false
        } else {
          clipPath.value = generateIrregularClipPath(progress)
        }
      }, 50)
    }
  })

  function closeMenu() {
    closingMenu.value = true
    revealIllustration.value = false
    isTransitioning.value = true
    setTimeout(() => {
      isTransitioning.value = false
      closingMenu.value = false
      toggleMenu()
    }, 700)
  }
</script>

<template>
  <div class="menu">
    <button
      class="toggle-button"
      :class="{ blocked: isTransitioning }"
      @click="handleToggleMenu"
    >
      <NuxtImg
        :src="buttonImgSrc"
        alt="Menu button image"
        class="base-shape"
        :class="{ rotated: isOpen }"
      />

      <div
        class="hamburger"
        :class="{ open: isOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <div
      v-if="isOpen"
      class="menu-wrapper"
    >
      <MaskedImage
        class="illustration"
        :image-src="illustrationImage"
        :mask-src="figureTopShape"
        :use-mask-as-top-shape="true"
        image-alt="Berliner Prater"
        :width="1920"
        :height="1080"
        :style="{ clipPath: clipPath }"
        :class="{ transitioning: isTransitioning, reveal: revealIllustration }"
      />
      <div class="menu-content-wrapper">
        <NuxtImg
          class="menu-shape"
          src="/svgs/menu/shapes/transition.svg"
          alt="Menu base shape"
          :class="{ closed: closingMenu }"
        />

        <div class="menu-content">
          <nav>
            <ul>
              <li
                v-for="(route, index) in menuRoutes"
                :key="index"
                :style="{
                  'animation-delay': closingMenu
                    ? `0s`
                    : `${menuTransitionTime / 3000 + index * 0.1}s`,
                }"
                :class="{ 'slide-out': closingMenu }"
              >
                <NuxtLink
                  :to="route.path"
                  @click="closeMenu"
                >
                  {{ route.title }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <div class="lang-switcher">
            <a
              v-for="locale in locales"
              :key="locale.code"
              href="#"
              :class="{ active: locale.code === currentLocale }"
              @click.prevent.stop="setLocale(locale.code)"
            >
              {{ locale.code }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .menu {
    position: fixed;
    top: var(--header-height);
    z-index: 100;
    width: 100%;
    height: calc(100vh);
    pointer-events: none;
  }

  .menu-shape {
    position: absolute;
    right: 17px;
    bottom: 17px;
    z-index: 1;
    width: 50px;
    height: 50px;
    transform: rotate(90deg) scale(25);
    animation-name: scale-up-and-rotate;
    animation-duration: 1s;

    &.closed {
      animation-name: scale-down-and-rotate;
      animation-duration: 0.5s;
      animation-delay: 0.3s;

      @media screen and (prefers-reduced-motion: reduce) {
        animation: none;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
      }
    }

    @media screen and (prefers-reduced-motion: reduce) {
      position: absolute;
      right: 17px;
      bottom: 17px;
      z-index: 1;
      width: 50px;
      height: 50px;
      transform: rotate(90deg) scale(25);
      animation: none;
      animation-duration: 1s;

      &.closed {
        animation-name: scale-down-and-rotate;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
      }
    }
  }

  @keyframes scale-up-and-rotate {
    from {
      transform: rotate(0deg) scale(1);
    }

    to {
      transform: rotate(90deg) scale(25);
    }
  }

  @keyframes scale-down-and-rotate {
    from {
      transform: rotate(90deg) scale(25);
    }

    to {
      transform: rotate(0deg) scale(1);
    }
  }

  .illustration {
    position: absolute;
    top: -50px;
    grid-area: illustration;
    width: 100%;
    height: 300px;
    padding: 0%;
    margin: 0;

    /* Initial state: Fully hidden */
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transition: clip-path 0.1s ease-in-out;

    @media screen and (prefers-reduced-motion: reduce) {
      position: absolute;
      top: -50px;
      grid-area: illustration;
      width: 100%;
      height: 300px;
      padding: 0%;
      margin: 0;

      /* Initial state: Fully hidden */
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
      transition: none;
    }

    &.reveal {
      /* Fully visible state */
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    }
  }

  .menu-content-wrapper {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    height: 80%;
    padding: 0;
    margin: 0;
    color: var(--light-beige);
  }

  .menu-content {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: fit-content;
    padding: 0;
    margin: 0;

    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      margin: 0;
      list-style: none;

      li {
        font-family: var(--link-font);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.5rem;
        color: var(--light-beige);
        text-align: right;
        cursor: pointer;
        opacity: 0;
        transform: translateX(10%);
        animation: slide 1s ease forwards;
        animation-direction: normal;

        &.slide-out {
          animation: slide-out 0.1s ease forwards;

          @media screen and (prefers-reduced-motion: reduce) {
            animation: none;
          }
        }

        @media screen and (prefers-reduced-motion: reduce) {
          font-family: var(--link-font);
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.5rem;
          color: var(--light-beige);
          text-align: right;
          cursor: pointer;
          opacity: 0;
          transform: translateX(10%);
          animation: none;
          animation-direction: normal;

          &.slide-out {
            animation: slide-out 0.1s ease forwards;
          }
        }

        & a {
          text-decoration: none;
        }
      }
    }
  }

  @keyframes slide {
    from {
      opacity: 0;
      transform: translateX(100%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }

    to {
      opacity: 0;
      transform: translateX(10%);
    }
  }

  .lang-switcher {
    display: flex;
    gap: 1rem;
    justify-content: right;
    padding: 1rem;
    margin: 0;
    color: var(--light-beige);

    a {
      padding: 0 0.5rem;
      font-family: var(--link-font);
      font-size: 1.25rem;
      line-height: 1.5rem;
      color: var(--light-beige);
      text-align: right;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;

      &.active {
        font-weight: 700;
        color: var(--black);
      }
    }
  }

  .toggle-button {
    position: fixed;
    right: var(--padding);
    bottom: var(--padding);
    z-index: 101;
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 0;
    pointer-events: all;
    cursor: pointer;
    background: none;
    border: 0;

    .base-shape {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 5px 5px rgb(0 0 0 / 20%));
      transform: rotate(0deg);
      transform-origin: center;
      transition: transform 0.5s ease-in-out;

      &.rotated {
        transform: rotate(90deg);
      }

      @media screen and (prefers-reduced-motion: reduce) {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 5px 5px rgb(0 0 0 / 20%));
        transform: rotate(0deg);
        transform-origin: center;
        transition: none;

        &.rotated {
          transform: rotate(90deg);
        }
      }
    }

    .hamburger {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      gap: 1px;
      justify-content: space-between;
      width: 15px;
      height: 15px;
      transform: translate(-50%, -50%);
      transition: transform 0.3s ease;

      span {
        width: 100%;
        height: 2px;
        background: var(--light-beige);
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;

        @media screen and (prefers-reduced-motion: reduce) {
          width: 100%;
          height: 2px;
          background: var(--light-beige);
          transition: none;
        }
      }

      &.open {
        span {
          &:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          - &:nth-child(3) {
            transform: translateY(-6px) rotate(-45deg);
          }
        }
      }

      @media screen and (prefers-reduced-motion: reduce) {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        gap: 1px;
        justify-content: space-between;
        width: 15px;
        height: 15px;
        transform: translate(-50%, -50%);
        transition: none;

        span {
          width: 100%;
          height: 2px;
          background: var(--light-beige);
          transition:
            transform 0.3s ease,
            opacity 0.3s ease;
        }

        &.open {
          span {
            &:nth-child(1) {
              transform: translateY(7px) rotate(45deg);
            }

            &:nth-child(2) {
              opacity: 0;
            }

            &:nth-child(3) {
              transform: translateY(-6px) rotate(-45deg);
            }
          }
        }
      }
    }

    &.blocked {
      pointer-events: none;
    }
  }
</style>
