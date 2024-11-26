<script setup lang="ts">
  const illustrationImage = '/imgs/prater/prater2.jpeg'
  const navTopShape = '/svgs/menu/shapes/background/viridian/1.svg'
  const figureTopShape = '/svgs/menu/shapes/background/mustard/1.svg'

  const {
    t,
    locale: currentLocale,
    locales,
    setLocale,
  } = useI18n({ useScope: 'global' })

  const router = useRouter()

  const order = ['index', 'prater', 'stories', 'create', 'about']

  const routes = computed(() =>
    router
      .getRoutes()
      .map((route) => {
        return {
          title: t(`components.menu.nav.${route.name as string}`),
          path: route.path,
          order: order.indexOf(route.name as string),
        }
      })
      .sort((a, b) => a.order - b.order)
  )
</script>

<template>
  <div class="menu">
    <MaskedImage
      class="illustration"
      :image-src="illustrationImage"
      :mask-src="figureTopShape"
      :use-mask-as-top-shape="true"
      image-alt="Illustration of Berliner Prater"
      :width="1920"
      :height="1080"
    />
    <div class="menu-content-wrapper">
      <img
        :src="navTopShape"
        alt=""
        class="nav-top-shape"
      />
      <div class="menu-content">
        <nav>
          <ul>
            <li
              v-for="(route, index) in routes"
              :key="index"
            >
              <NuxtLink :to="route.path">{{ route.title }}</NuxtLink>
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
</template>

<style scoped>
  .menu {
    position: fixed;
    top: var(--header-height);
    z-index: 2;
    width: 100%;
    height: calc(100vh - var(--header-height));
  }

  .illustration {
    position: absolute;
    grid-area: illustration;
    width: 100%;
    padding: 0%;
    margin: 0;
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
    height: 100%;
    background: var(--viridian);
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
      }

      li a {
        text-decoration: none;
      }
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
      text-decoration: none;
      text-transform: uppercase;
      cursor: pointer;

      &.active {
        font-weight: 700;
        color: var(--black);
      }
    }
  }
</style>
