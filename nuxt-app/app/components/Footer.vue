<script setup lang="ts">
  const { footerRoutes } = useMenu()
</script>

<template>
  <footer class="footer">
    <div class="top-shape">
      <img
        src="/svgs/textures/noise.svg"
        alt=""
        class="top-texture"
      />
      <img
        src="/svgs/footer/top-shape.svg"
        alt=""
        :style="{ filter: 'contrast(1.6) sepia(0.25)', marginBottom: '-2px' }"
      />
    </div>
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
    <div class="background">
      <div class="vignette" />
      <div class="overlay" />
      <div class="texture" />
    </div>
  </footer>
</template>

<style scoped>
  footer {
    display: grid;
    grid-template-areas: 'top-shape' 'content';
    grid-template-rows: 22px 1fr;
    height: calc(100vh - var(--header-height));
    container-type: inline-size;
    container-name: footer;

    @container (min-width: 768px) {
      height: auto;
    }

    @media (min-height: 1024px) {
      height: auto;
    }
  }

  .top-shape {
    display: grid;
    grid-area: top-shape;
    width: 100%;
    height: 22px;

    img {
      grid-area: 1 / 1;
      width: 100%;
      height: 23px;
      object-fit: cover;
    }
  }

  .top-texture {
    mix-blend-mode: multiply;
  }

  .footer-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-area: content;
    gap: 2rem;
    width: 100%;
    max-width: var(--main-max-width);
    padding: 80px var(--padding-mobile);
    margin: 0 auto;
    overflow: hidden;
    color: var(--color-beige);
    container-type: inline-size;
    container-name: footer-content;

    @container (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: var(--padding-desktop);
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
    font-size: 1.1rem;
    color: var(--color-beige);
  }

  nav {
    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0;
      margin: 0;
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
    font-size: 0.9rem;
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

  .background {
    z-index: -1;
    display: grid;
    grid-area: content;
    width: 100%;
    height: 100%;
  }

  .texture {
    z-index: -3;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    background: url('@/assets/svgs/noise.svg');
    opacity: 1;
  }

  .overlay {
    z-index: -2;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    background: var(--color-viridian);
    mix-blend-mode: multiply;
  }

  .vignette {
    z-index: -1;
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    box-shadow:
      inset 10px 20px 300px 0 var(--color-black),
      inset -10px -20px 300px 0 var(--color-black),
      inset 20px -10px 300px 0 var(--color-black),
      inset -20px 10px 300px 0 var(--color-black);
    mix-blend-mode: multiply;
    opacity: 0.1;
  }
</style>
