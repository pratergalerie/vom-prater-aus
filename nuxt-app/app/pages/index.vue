<script setup lang="ts">
  useHead({
    title: 'Vom Prater aus',

    meta: [
      {
        name: 'description',
        content: 'Home page',
      },
    ],
  })
</script>

<template>
  <div class="layout-container">
    <StoriesCarousel />

    <section>
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.stories.title') }}</h2>
        <p>{{ $t('pages.home.sections.stories.text') }}</p>
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
        src="imgs/postkarte1895.jpg"
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
        src="imgs/konzertKindertag1986.jpg"
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

    & .section-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-s-m);
    }

    &:nth-child(even) {
      align-items: flex-end;

      & .section-text {
        text-align: right;
      }
    }
  }
</style>
