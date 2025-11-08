<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('components.menu.nav.index')}`,
  })
</script>

<template>
  <div class="layout-container">
    <StoriesCarousel />

    <section>
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.stories.title') }}</h2>
        <p>{{ $t('pages.home.sections.stories.text.p1') }}</p>
        <p>{{ $t('pages.home.sections.stories.text.p2') }}</p>
      </div>
      <BaseButton
        variant="primary"
        layout="label"
        :label="$t('pages.home.sections.stories.button')"
        href="/stories"
      />
    </section>

    <!-- Prater Section -->
    <section>
      <CaptionImage
        :caption="$t('images.postkarte1895.caption')"
        src="imgs/postkarte1895.webp"
        :alt="$t('images.postkarte1895.alt')"
      />
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.prater.title') }}</h2>
        <p>{{ $t('pages.home.sections.prater.text') }}</p>
      </div>
      <BaseButton
        variant="primary"
        layout="label"
        :label="$t('pages.home.sections.prater.button')"
        href="/prater"
      />
    </section>

    <!-- Create Section -->
    <section>
      <CaptionImage
        :caption="$t('images.konzertKindertag1986.caption')"
        src="imgs/konzertKindertag1986.webp"
        :alt="$t('images.konzertKindertag1986.alt')"
      />
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.create.title') }}</h2>
        <p>{{ $t('pages.home.sections.create.text') }}</p>
      </div>
      <BaseButton
        variant="primary"
        layout="label"
        :label="$t('pages.home.sections.create.button')"
        href="/stories/create"
      />
    </section>
  </div>
</template>

<style scoped>
  .layout-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl-3xl);
    width: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
    align-items: flex-start;

    & .image-caption {
      max-width: 80%;
    }

    & .section-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-s-m);
    }

    &:nth-child(even) {
      align-items: flex-end;

      & > div:nth-child(even),
      div:nth-child(odd) {
        text-align: right;
      }
    }
  }
</style>
