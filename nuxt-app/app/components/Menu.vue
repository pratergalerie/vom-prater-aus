<script setup lang="ts">
  const illustrationImage = ref<string>('')

  const {
    locale: currentLocale,
    locales,
    setLocale,
  } = useI18n({ useScope: 'global' })

  const { isOpen, toggleMenu, menuRoutes } = useMenu()

  const languageSwitcherDelay = computed(() => {
    return `${(menuRoutes.value.length + 1) * 0.1}s`
  })

  const dividerDelay = computed(() => {
    return `${menuRoutes.value.length * 0.1}s`
  })

  function chooseRandomMenuImage() {
    const randomImage = Math.floor(Math.random() * 10) + 1
    illustrationImage.value = `/imgs/prater/prater${randomImage}.jpeg`
  }

  const windowSize = useWindowSize()

  const menuTopSvgSrc = computed(() => {
    if (windowSize.width.value <= 500) {
      return 'url(/svgs/menu/menu-masks/mobile.svg) top no-repeat, linear-gradient(black 0 0)'
    } else if (windowSize.width.value > 500 && windowSize.width.value <= 1000) {
      return 'url(/svgs/menu/menu-masks/tablet.svg) top no-repeat, linear-gradient(black 0 0)'
    } else {
      return 'url(/svgs/menu/menu-masks/desktop.svg) top no-repeat, linear-gradient(black 0 0)'
    }
  })

  const illustrationMask = computed(() => {
    if (windowSize.width.value <= 500) {
      return 'url(/svgs/menu/illustration-masks/mobile.svg) top no-repeat, linear-gradient(black 0 0)'
    } else if (windowSize.width.value > 500 && windowSize.width.value <= 1000) {
      return 'url(/svgs/menu/illustration-masks/tablet.svg) top no-repeat, linear-gradient(black 0 0)'
    } else {
      return 'url(/svgs/menu/illustration-masks/desktop.svg) top no-repeat, linear-gradient(black 0 0)'
    }
  })

  const closingMenu = ref(false)
  const revealIllustration = ref(false)
  const isTransitioning = ref(false)

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
    isTransitioning.value = false
    closingMenu.value = false
    toggleMenu()
  }
</script>

<template>
  <Teleport to="#teleports">
    <div
      v-if="isOpen"
      class="menu-container"
      :class="{ 'menu-visible': isOpen && !closingMenu }"
    >
      <div class="illustration">
        <NuxtImg
          :src="illustrationImage"
          alt="Berliner Prater"
        />
      </div>
      <menu aria-label="Menu">
        <nav>
          <ul>
            <li
              v-for="(route, index) in menuRoutes"
              :key="index"
              :class="{ 'slide-out': closingMenu }"
              :style="{
                '--animation-delay': `${index * 0.1}s`,
              }"
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

        <div class="divider-container">
          <Divider
            type="horizontal"
            color="var(--color-beige)"
            width="40%"
            class="divider"
            :style="{
              '--animation-delay': dividerDelay,
            }"
          />
        </div>

        <div
          class="lang-switcher"
          aria-label="Language switcher"
        >
          <a
            v-for="locale in locales"
            :key="locale.code"
            href="#"
            :class="{
              active: locale.code === currentLocale,
              highlight: locale.code === currentLocale,
            }"
            :style="{
              '--animation-delay': languageSwitcherDelay,
            }"
            @click.prevent.stop="setLocale(locale.code)"
          >
            {{ locale.code }}
          </a>
        </div>
      </menu>
    </div>
  </Teleport>
</template>

<style scoped>
  * {
    --animation-delay: 0s;
  }

  .menu-container {
    position: fixed;
    top: var(--header-height);
    z-index: 100;
    width: 100%;
    height: calc(100vh - var(--header-height));
    pointer-events: none;
    container-name: menu-container;
    container-type: size;
    contain: size layout style;
  }

  .illustration {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-mustard);
    mask: v-bind(illustrationMask);
    mask-size: 100% auto;
    mask-composite: exclude;

    img {
      position: absolute;
      top: calc(var(--header-height));
      left: 50%;
      height: 70%;
      padding: 0%;
      margin: 0;
      object-fit: cover;
      mix-blend-mode: multiply;
      filter: grayscale(1);
      transform: translate(-50%, -50%);
    }
  }

  .menu-top {
    display: block;
    width: 100%;
    height: 80px;
    object-fit: cover;
  }

  menu {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80%;
    padding: 0 var(--padding-mobile);
    margin: 0;
    color: var(--color-beige);
    pointer-events: all;
    outline: none;
    background-color: var(--color-viridian);
    mask: v-bind(menuTopSvgSrc);
    mask-size: 100% auto;
    mask-composite: exclude;

    @container menu-container (min-width: 500px) {
      padding: 0 var(--padding-tablet);
    }

    @container menu-container (min-width: 1000px) {
      padding: 0 var(--padding-desktop);
    }

    @container menu-container (max-height: 750px) {
      justify-content: flex-start;
      padding-top: 50px;
    }
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: fit-content;
    padding: 0;
    margin: 0;

    @container (min-width: 1000px) {
      max-width: 1000px;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-family: var(--font-link);
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5rem;
      color: var(--color-beige);
      text-align: right;
      cursor: pointer;
      opacity: 0;
      transform: translateX(-20px);
      animation: none;

      &.slide-out {
        animation: none;
      }

      & a {
        text-decoration: none;
      }

      @container menu-container (min-width: 500px) {
        font-size: 1.5rem;
        line-height: 2rem;
      }

      @container menu-container (min-width: 1000px) {
        font-size: 2rem;
        line-height: 3rem;
      }
    }
  }

  .menu-container:not(.menu-visible) menu li {
    opacity: 0;
    transform: translateX(-20px);
    animation: none;
  }

  .menu-container.menu-visible menu li {
    animation: slide-in 0.3s ease-out forwards;
    animation-delay: var(--animation-delay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
      animation-delay: var(--animation-delay);
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(20px);
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
      transform: translateX(20px);
    }
  }

  .divider-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    max-width: 1000px;
  }

  .lang-switcher {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    max-width: 1000px;
    margin: 0;
    color: var(--color-beige);
    opacity: 0;
    transform: translateX(20px);
    animation: slide-in 0.3s ease-out forwards;
    animation-delay: v-bind(languageSwitcherDelay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
      animation-delay: v-bind(languageSwitcherDelay);
    }

    a {
      padding: 0 0.5rem;
      font-family: var(--font-link);
      font-size: 1rem;
      line-height: 1.5rem;
      color: var(--color-beige);
      text-align: right;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;

      &.active {
        font-weight: 700;
        color: var(--color-black);
      }

      @container menu-container (min-width: 500px) {
        font-size: 1.5rem;
        line-height: 2rem;
      }

      @container menu-container (min-width: 1000px) {
        font-size: 2rem;
        line-height: 3rem;
      }
    }
  }

  .divider {
    opacity: 1;

    & :deep(.divider-path) {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw-path 0.5s ease-out forwards;
      animation-delay: v-bind(dividerDelay);

      @media screen and (prefers-reduced-motion: reduce) {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: none;
        animation-delay: v-bind(dividerDelay);
      }
    }
  }

  @keyframes draw-path {
    from {
      stroke-dashoffset: 1000;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  @media screen and (prefers-reduced-motion: reduce) {
    .divider :deep(.divider-path) {
      stroke-dasharray: none;
      stroke-dashoffset: 0;
      animation: none;
    }
  }
</style>
