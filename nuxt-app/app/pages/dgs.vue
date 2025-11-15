<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.dgs.title')}`,
  })

  // Define all video keys manually to avoid reactive proxy issues
  const videoKeys = [
    'about',
    'navigation',
    'accessibility',
    'history',
    'beginnings',
    'coffeeKitchen',
    'gardenLocations',
    'boxingMatches',
    'defaPremiere',
    'renovation',
    'reopening',
    'openAirStage',
    'firstGallery',
    'districtCulturalCenter',
    'galleryAtPrater',
    'constructionWork',
    'chance2000',
    'bastardClub',
    'galleryInPrater',
  ]

  // Get all videos from the translation file
  const videos = computed(() => {
    return videoKeys.map((key) => ({
      key,
      title: t(`pages.dgs.videos.${key}.title`),
      videoId: parseInt(t(`pages.dgs.videos.${key}.videoId`), 10),
    }))
  })
</script>

<template>
  <div class="layout-container">
    <section class="intro-section">
      <h1>{{ t('pages.dgs.title') }}</h1>
      <i18n-t
        keypath="pages.dgs.fischSigns.text"
        tag="span"
      >
        <a
          class="dark"
          target="_blank"
          rel="noopener noreferrer"
          :href="$t('pages.dgs.fischSigns.link.url')"
          >{{ $t('pages.dgs.fischSigns.link.text') }}</a
        >
      </i18n-t>
    </section>

    <div class="videos-container">
      <section
        v-for="video in videos"
        :key="video.key"
        class="video-section"
      >
        <h2>{{ video.title }}</h2>
        <VimeoPlayer :id="video.videoId" />
      </section>
    </div>
  </div>
</template>

<style scoped>
  a {
    font-family: var(--font-text);

    &:hover,
    &:focus {
      color: var(--color-brown);
    }
  }

  .layout-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl-3xl);
    width: 100%;
  }

  .intro-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  .videos-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl-3xl);
  }

  .video-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }
</style>
