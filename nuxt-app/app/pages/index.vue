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
    <!-- Stories Section -->
    <section>
      <StoriesCarousel />
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.stories.title') }}</h2>
        <p>{{ $t('pages.home.sections.stories.text') }}</p>
      </div>
      <BaseButton
        class="button"
        variant="primary"
        layout="label"
        :label="$t('pages.home.sections.stories.button')"
        href="/stories"
      />
    </section>

    <!-- Prater Section -->
    <section>
      <NuxtPicture
        src="imgs/anfaenge-prater.jpg"
        :alt="$t('pages.home.sections.prater.imageAlt')"
      />
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.prater.title') }}</h2>
        <p>{{ $t('pages.home.sections.prater.text') }}</p>
      </div>
      <BaseButton
        class="button"
        variant="primary"
        layout="label"
        :label="$t('pages.home.sections.prater.button')"
        href="/prater"
      />
    </section>

    <!-- Create Section -->
    <section>
      <NuxtPicture
        src="imgs/kreiskulturhaus-1.jpg"
        :alt="$t('pages.home.sections.create.imageAlt')"
      />
      <div class="section-text">
        <h2>{{ $t('pages.home.sections.create.title') }}</h2>
        <p>{{ $t('pages.home.sections.create.text') }}</p>
      </div>
      <BaseButton
        class="button"
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

    & .section-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-s-m);
    }

    &:nth-child(even) {
      align-items: flex-end;

      & picture {
        width: 100%;
        max-width: 70%;
      }

      & .section-text {
        text-align: right;
      }
    }
  }
</style>
