<script setup lang="ts">
  const { footerRoutes } = useMenu()
</script>

<template>
  <div class="footer-wrapper">
    <footer>
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

      <div class="title-and-nav">
        <nav>
          <ul>
            <div class="accessibility-links">
              <Divider
                type="horizontal"
                color="var(--color-beige)"
                width="40%"
                class="divider"
                margin="var(--space-2xs) 0"
              />
              <li>
                <NuxtLink to="/accessibility">
                  {{ $t('components.menu.nav.accessibility') }}
                  <Icon name="mdi:accessibility" />
                </NuxtLink>
              </li>

              <div>
                <li>
                  <!-- TODO: Add link -->
                  <NuxtLink to="/">
                    {{ $t('components.menu.nav.simpleLanguage') }}
                    <Icon name="mdi:book-open-variant-outline" />
                  </NuxtLink>
                </li>

                <li>
                  <!-- TODO: Add link -->
                  <NuxtLink to="/">
                    {{ $t('components.menu.nav.dgs') }}
                    <Icon name="mdi:sign-language-outline" />
                  </NuxtLink>
                </li>
              </div>
            </div>
          </ul>

          <Divider
            type="horizontal"
            color="var(--color-beige)"
            width="40%"
            class="divider"
            margin="var(--space-2xs) 0"
          />

          <LanguageSwitcher />
          <AccessibilityActions />
        </nav>
      </div>

      <div class="logos-and-text">
        <i18n-t
          keypath="components.footer.contact.text"
          tag="p"
          class="contact-email"
        >
          <a :href="`mailto:${$t('components.footer.contact.email')}`">{{
            $t('components.footer.contact.email')
          }}</a>
        </i18n-t>
        <p>
          {{ $t('components.footer.text') }}
        </p>
        <div class="logos">
          <a
            href="https://pratergalerie.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/prater-galerie.svg"
              alt="Prater Galerie"
            />
          </a>
          <a
            href="https://kgberlin.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/kommunale.webp"
              alt="Kommunale Galerien Berlin"
            />
          </a>
          <a
            href="https://berlin.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/berlin-stadt-regierung.png"
              alt="https://www.berlin.de/ba-pankow/"
            />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .footer-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 var(--space-s-m);
    color: var(--color-beige);
    background: var(--color-viridian);
    clip-path: polygon(
      0% 8.8%,
      26.98% 7.02%,
      43.98% 13.02%,
      70.85% 5.15%,
      97.26% 10.74%,
      100% 13.75%,
      100% 100%,
      0% 100%
    );
  }

  footer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
    gap: var(--space-l);
    width: 100%;
    max-width: var(--max-width);
    padding: var(--space-2xl-3xl) 0;
    padding-bottom: var(--space-l-xl);
    margin-top: var(--space-xl-2xl);
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
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    /* stylelint-disable-next-line */
    font-size: var(--step--1);

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
      padding: 0;
      margin: 0;
      list-style-type: none;
    }

    a {
      display: flex;
      gap: var(--space-2xs);
      align-items: center;
      font-size: inherit;
      text-decoration: none;
    }
  }

  p {
    margin: 0;
    /* stylelint-disable-next-line */
    font-size: var(--step--1);
    color: var(--color-beige);
  }

  .contact-email {
    a {
      font-family: var(--font-text);
      text-decoration: underline;
      text-underline-offset: 0.5em;
    }
  }

  .logos {
    display: flex;
    gap: var(--space-xs);
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    height: 70px;

    @media (min-width: 500px) {
      justify-content: flex-start;
    }
  }

  .accessibility-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs-2xs);
    align-items: flex-start;

    & > div {
      display: flex;
      gap: var(--space-s);
    }
  }

  /* Hide dividers when grid wraps to fewer columns */
  /* stylelint-disable-next-line a11y/no-display-none */
  .divider {
    display: block;

    @media (min-width: 700px) {
      display: none;
    }
  }
</style>
