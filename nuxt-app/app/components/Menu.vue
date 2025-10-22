<script setup lang="ts">
  const illustrationImage = ref<string>('')

  const { isOpen, toggleMenu, menuRoutes } = useMenu()

  const languageSwitcherDelay = computed(() => {
    return `${(menuRoutes.value.length + 1) * 0.1}s`
  })

  const dividerDelay = computed(() => {
    return `${menuRoutes.value.length * 0.1}s`
  })

  function chooseRandomMenuImage() {
    const randomImage = Math.floor(Math.random() * 4) + 1
    illustrationImage.value = `/imgs/menu/image-${randomImage}.jpg`
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

  const revealIllustration = ref(false)
  const menuClipPath = ref('polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)')
  const illustrationClipPath = ref('polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)')
  const isMenuTransitioning = ref(false)
  const isIllustrationTransitioning = ref(false)

  const isTransitioning = ref(false)
  const isVisible = ref(false)

  function generateIrregularClipPath(
    progress: number,
    element: 'menu' | 'illustration'
  ): string {
    const irregularities = Array.from(
      { length: 7 },
      () => Math.random() * 20 - 10
    ) // More points and larger range for irregularities

    // For menu: fixed right edge, animated left edge
    // For illustration: fixed left edge, animated right edge
    const left = element === 'menu' ? 100 - progress * 100 : 0
    const right = element === 'menu' ? 100 : progress * 100

    // Generate points for the animated edge
    const animatedEdge = element === 'menu' ? 'left' : 'right'

    return `polygon(
    ${animatedEdge === 'left' ? `${left + (irregularities[0] || 0)}%` : `${left}%`} 0%,
    ${animatedEdge === 'right' ? `${right + (irregularities[0] || 0)}%` : `${right}%`} 0%,
    ${animatedEdge === 'right' ? `${right + (irregularities[1] || 0)}%` : `${right}%`} 15%,
    ${animatedEdge === 'right' ? `${right + (irregularities[2] || 0)}%` : `${right}%`} 30%,
    ${animatedEdge === 'right' ? `${right + (irregularities[3] || 0)}%` : `${right}%`} 45%,
    ${animatedEdge === 'right' ? `${right + (irregularities[4] || 0)}%` : `${right}%`} 60%,
    ${animatedEdge === 'right' ? `${right + (irregularities[5] || 0)}%` : `${right}%`} 75%,
    ${animatedEdge === 'right' ? `${right + (irregularities[6] || 0)}%` : `${right}%`} 100%,
    ${animatedEdge === 'left' ? `${left + (irregularities[6] || 0)}%` : `${left}%`} 100%,
    ${animatedEdge === 'left' ? `${left + (irregularities[5] || 0)}%` : `${left}%`} 85%,
    ${animatedEdge === 'left' ? `${left + (irregularities[4] || 0)}%` : `${left}%`} 70%,
    ${animatedEdge === 'left' ? `${left + (irregularities[3] || 0)}%` : `${left}%`} 55%,
    ${animatedEdge === 'left' ? `${left + (irregularities[2] || 0)}%` : `${left}%`} 40%,
    ${animatedEdge === 'left' ? `${left + (irregularities[1] || 0)}%` : `${left}%`} 25%,
    ${animatedEdge === 'left' ? `${left + (irregularities[0] || 0)}%` : `${left}%`} 10%
  )`
  }

  function animateMenuClipPath(reveal: boolean) {
    isMenuTransitioning.value = true
    let progress = reveal ? 0 : 1

    const interval = setInterval(() => {
      if (reveal) {
        progress += 0.25
        if (progress >= 1) {
          progress = 1
          menuClipPath.value = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          clearInterval(interval)
          isMenuTransitioning.value = false
          // Start illustration animation after menu is done
          setTimeout(() => {
            animateIllustrationClipPath(true)
          }, 200)
        } else {
          menuClipPath.value = generateIrregularClipPath(progress, 'menu')
        }
      } else {
        progress -= 0.2
        if (progress <= 0) {
          progress = 0
          menuClipPath.value = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
          clearInterval(interval)
          isMenuTransitioning.value = false
          // Start illustration animation after menu is done
          setTimeout(() => {
            animateIllustrationClipPath(false)
          }, 200)
        } else {
          menuClipPath.value = generateIrregularClipPath(progress, 'menu')
        }
      }
    }, 75)
  }

  function animateIllustrationClipPath(reveal: boolean) {
    isIllustrationTransitioning.value = true
    let progress = reveal ? 0 : 1

    const interval = setInterval(() => {
      if (reveal) {
        progress += 0.25
        if (progress >= 1) {
          progress = 1
          illustrationClipPath.value =
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          clearInterval(interval)
          isIllustrationTransitioning.value = false
        } else {
          illustrationClipPath.value = generateIrregularClipPath(
            progress,
            'illustration'
          )
        }
      } else {
        progress -= 0.2
        if (progress <= 0) {
          progress = 0
          illustrationClipPath.value = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
          clearInterval(interval)
          isIllustrationTransitioning.value = false
        } else {
          illustrationClipPath.value = generateIrregularClipPath(
            progress,
            'illustration'
          )
        }
      }
    }, 75)
  }

  watch(isOpen, async (open) => {
    if (open) {
      isVisible.value = true
      await nextTick()
      revealIllustration.value = true
      animateMenuClipPath(true)
      chooseRandomMenuImage()
    } else {
      isTransitioning.value = true
      // First animate the illustration out
      animateIllustrationClipPath(false)
      // Then after illustration animation completes, animate the menu out
      setTimeout(() => {
        animateMenuClipPath(false)
        // Finally hide everything after menu animation completes
        setTimeout(() => {
          isVisible.value = false
          isTransitioning.value = false
        }, 500)
      }, 300) // Time for illustration animation to complete
    }
  })

  function closeMenu() {
    toggleMenu()
  }
</script>

<template>
  <Transition>
    <div
      v-if="isVisible"
      class="menu-container"
      :class="{ 'menu-visible': isOpen, 'menu-closing': isTransitioning }"
    >
      <div
        class="illustration"
        :style="{
          clipPath: illustrationClipPath,
          transition: isIllustrationTransitioning
            ? 'none'
            : 'clip-path 0.3s ease',
        }"
      >
        <NuxtPicture
          :src="illustrationImage"
          alt=""
          :modifiers="{ grayscale: true }"
          :img-attrs="{
            style: 'display: block; height: 100%;',
          }"
        />
      </div>
      <menu
        aria-label="Menu"
        :style="{
          clipPath: menuClipPath,
          transition: isMenuTransitioning ? 'none' : 'clip-path 0.3s ease',
        }"
      >
        <nav>
          <ul>
            <li
              v-for="(route, index) in menuRoutes"
              :key="index"
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

          <div class="divider-container">
            <Divider
              type="horizontal"
              color="var(--color-beige)"
              width="40%"
              class="divider"
              margin="var(--space-xs) 0"
              :style="{
                '--animation-delay': dividerDelay,
              }"
            />
          </div>

          <div
            class="lang-switcher-wrapper"
            :style="{
              '--animation-delay': languageSwitcherDelay,
            }"
          >
            <LanguageSwitcher />
          </div>
        </nav>
      </menu>
    </div>
  </Transition>
</template>

<style scoped>
  .menu-container {
    position: fixed;
    top: 0;
    z-index: 900;
    display: grid;
    grid-template: 'stack' 1fr / 1fr;
    width: 100%;
    height: 100svh;
    pointer-events: none;
  }

  .illustration {
    z-index: 1;
    grid-area: stack;
    align-self: flex-start;
    width: 100%;
    height: 60svh;
    background-color: var(--color-mustard);
    mask: v-bind(illustrationMask);
    mask-size: 100% auto;
    mask-composite: exclude;
    transition:
      opacity 0.3s ease,
      clip-path 0.3s ease;

    picture {
      display: block;
      height: 100%;
      mix-blend-mode: multiply;
    }

    @media screen and (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  menu {
    --animation-time: 0.2s;

    z-index: 2;
    display: flex;
    grid-area: stack;
    align-self: flex-end;
    justify-content: flex-end;
    width: 100%;
    padding: 0;
    margin: 0;
    pointer-events: all;
    outline: none;
    background-color: var(--color-viridian);
    mask: v-bind(menuTopSvgSrc);
    mask-size: 100% auto;
    mask-composite: exclude;

    &::before {
      position: absolute;
      inset: 0;
      pointer-events: none;
      content: '';
      background-image: url('/imgs/textures/paper/1.webp');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      mix-blend-mode: multiply;
      opacity: 1;
    }
  }

  nav {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: var(--max-width);
    min-height: 50svh;
    padding: var(--space-3xl) var(--space-s-m);
    margin: 0 auto;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      --animation-delay: 0s;

      color: var(--color-beige);
      text-align: right;
      cursor: pointer;
      opacity: 0;
      transform: translateX(-20px);
      animation: none;

      a {
        text-decoration: none;
      }

      &.slide-out {
        animation: none;
      }
    }
  }

  .divider {
    opacity: 1;

    & :deep(.divider-path) {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw-path 0.3s ease-out forwards;
      animation-delay: v-bind(dividerDelay);

      @media screen and (prefers-reduced-motion: reduce) {
        stroke-dasharray: none;
        stroke-dashoffset: 0;
        animation: none;
      }
    }
  }

  .menu-container:not(.menu-visible) menu li {
    opacity: 1;
    transform: translateX(0);
    transform-origin: right center;
    animation: slide-out var(--animation-time) ease-out forwards;
    animation-delay: var(--animation-delay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .menu-container.menu-visible menu li {
    opacity: 0;
    transform: translateX(20px);
    transform-origin: right center;
    animation: slide-in var(--animation-time) ease-out forwards;
    animation-delay: var(--animation-delay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .menu-container:not(.menu-visible) .divider {
    opacity: 1;
    transform: translateX(0);
    transform-origin: right center;
    animation: slide-out var(--animation-time) ease-out forwards;
    animation-delay: v-bind(dividerDelay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .menu-container.menu-visible .divider {
    opacity: 0;
    transform: translateX(20px);
    transform-origin: right center;
    animation: slide-in var(--animation-time) ease-out forwards;
    animation-delay: v-bind(dividerDelay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .lang-switcher-wrapper {
    display: flex;
    justify-content: flex-end;
    margin: 0;
    opacity: 0;
    transform: translateX(20px);
    animation: slide-in var(--animation-time) ease-out forwards;
    animation-delay: var(--animation-delay);

    @media screen and (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(4ch);
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
      transform: translateX(4ch);
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

  .divider-container {
    display: flex;
    justify-content: flex-end;
  }

  .menu-closing {
    pointer-events: none;
  }
</style>
