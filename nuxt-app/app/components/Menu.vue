<script setup lang="ts">
  const illustrationImage = ref<string>('')

  const {
    locale: currentLocale,
    locales,
    setLocale,
  } = useI18n({ useScope: 'global' })

  const { isOpen, toggleMenu, menuRoutes } = useMenu()

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
    setTimeout(() => {
      isTransitioning.value = false
      closingMenu.value = false
      toggleMenu()
    }, 700)
  }
</script>

<template>
  <Teleport to="#teleports">
    <div
      v-if="isOpen"
      class="menu-container"
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

        <div
          class="lang-switcher"
          aria-label="Language switcher"
        >
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
      </menu>
    </div>
  </Teleport>
</template>

<style scoped>
  .menu-container {
    position: fixed;
    top: var(--header-height);
    z-index: 100;
    width: 100%;
    height: calc(100vh);
    pointer-events: none;
    container-name: menu;
    container-type: inline-size;
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
    padding: 0;
    margin: 0;
    color: var(--color-beige);
    pointer-events: all;
    background-color: var(--color-viridian);
    mask: v-bind(menuTopSvgSrc);
    mask-size: 100% auto;
    mask-composite: exclude;
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
        font-family: var(--font-link);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.5rem;
        color: var(--color-beige);
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
          font-family: var(--font-link);
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.5rem;
          color: var(--color-beige);
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

        @container (min-width: 500px) {
          font-size: 2rem;
          line-height: 3rem;
        }
      }
    }

    @container (min-width: 1000px) {
      max-width: 1000px;
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
    color: var(--color-beige);

    a {
      padding: 0 0.5rem;
      font-family: var(--font-link);
      font-size: 1.25rem;
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
    }
  }
</style>
