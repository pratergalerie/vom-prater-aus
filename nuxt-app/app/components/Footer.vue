<script setup lang="ts">
  const { footerRoutes } = useMenu()

  const footerRef = ref<HTMLElement | null>(null)

  const footerHeight = computed(() => {
    if (!footerRef.value) return 'auto'
    const heightPx = `${useElementSize(footerRef).height.value + 100}px`
    return heightPx
  })

  watch(footerHeight, (newHeight) => {
    document.documentElement.style.cssText = `--footer-height: ${newHeight}`
  })
</script>

<template>
  <footer
    ref="footerRef"
    class="footer"
  >
    <div class="top-shape">
      <img
        src="/svgs/footer/top-shape.svg"
        alt=""
      />
    </div>
    <div class="footer-wrapper">
      <div class="footer-content">
        <div class="title-and-nav">
          <h2>{{ $t('components.footer.title') }}</h2>
          <nav>
            <ul>
              <li
                v-for="(route, index) in footerRoutes"
                :key="index"
              >
                <NuxtLink :to="route.path">{{ route.title }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
        <div class="logos-and-text">
          <p>
            {{ $t('components.footer.text') }}
          </p>
          <div class="logos">
            <img
              src="/logos/prater-galerie.svg"
              alt="Logo"
            />
            <img
              src="/logos/kommunale.png"
              alt="Logo"
            />
            <img
              src="/logos/berlin-stadt-regierung.png"
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  footer {
    display: flex;
    flex-direction: column;
  }

  .top-shape {
    width: 100%;
    height: 22px;

    img {
      width: 100%;
      height: 22px;
      object-fit: cover;
    }
  }

  .footer-wrapper {
    width: 100%;
    background: var(--color-viridian);
  }

  .footer-content {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
    gap: 2rem;
    max-width: var(--max-width);
    padding: var(--space-2xl-3xl) var(--space-s-m);
    margin: 0 auto;
    overflow: hidden;
    color: var(--color-beige);
    container-type: inline-size;
    container-name: footer-content;

    @container (min-width: 768px) {
      display: grid;
    }
  }

  .title-and-nav,
  .logos-and-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .logos-and-text {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h2 {
    margin: 0;
    font-size: var(--step-1);
    color: var(--color-beige);
  }

  nav {
    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0;
      margin: 0;
      font-size: var(--step-0);
      list-style-type: none;

      @media (max-height: 700px) {
        gap: 0.5rem;
      }
    }

    a {
      color: var(--color-beige);
    }
  }

  p {
    margin: 0;
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
    color: var(--color-beige);
  }

  .logos {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    height: 70px;

    @media (min-width: 500px) {
      justify-content: flex-start;
    }

    img {
      width: auto;
      max-width: 30%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>
