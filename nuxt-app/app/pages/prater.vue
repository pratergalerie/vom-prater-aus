<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: t('pages.prater.title'),
    meta: [
      {
        name: 'description',
        content: t('pages.prater.intro.description.p1'),
      },
    ],
  })
</script>

<template>
  <article>
    <section>
      <div class="intro">
        <h1>{{ t('pages.prater.title') }}</h1>
        <p>
          {{ t('pages.prater.intro.description.p1') }}
        </p>
        <p>
          {{ t('pages.prater.intro.description.p2') }}
        </p>
      </div>

      <div class="timeline">
        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.beginnings.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.beginnings.year')
            }}</span>
            <p>{{ t('pages.prater.history.beginnings.text.p1') }}</p>
            <p>{{ t('pages.prater.history.beginnings.text.p2') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.coffeeKitchen.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.coffeeKitchen.year')
            }}</span>
            <p>{{ t('pages.prater.history.coffeeKitchen.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.gardenLocations.title') }}</h2>
            <p>{{ t('pages.prater.history.gardenLocations.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.boxingMatches.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.boxingMatches.year')
            }}</span>
            <p>{{ t('pages.prater.history.boxingMatches.text.p1') }}</p>
            <p>{{ t('pages.prater.history.boxingMatches.text.p2') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.defaPremiere.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.defaPremiere.year')
            }}</span>
            <p>{{ t('pages.prater.history.defaPremiere.text.p1') }}</p>
            <p>{{ t('pages.prater.history.defaPremiere.text.p2') }}</p>
            <p>{{ t('pages.prater.history.defaPremiere.text.p3') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.renovation.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.renovation.year')
            }}</span>
            <p>{{ t('pages.prater.history.renovation.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.reopening.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.reopening.year')
            }}</span>
            <p>{{ t('pages.prater.history.reopening.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.openAirStage.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.openAirStage.year')
            }}</span>
            <p>{{ t('pages.prater.history.openAirStage.text.p1') }}</p>
            <p>{{ t('pages.prater.history.openAirStage.text.p2') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.firstGallery.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.firstGallery.year')
            }}</span>
            <p>{{ t('pages.prater.history.firstGallery.text.p1') }}</p>
            <p>{{ t('pages.prater.history.firstGallery.text.p2') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>
              {{ t('pages.prater.history.districtCulturalCenter.title') }}
            </h2>
            <span class="year">{{
              t('pages.prater.history.districtCulturalCenter.year')
            }}</span>
            <p>
              {{ t('pages.prater.history.districtCulturalCenter.text.p1') }}
            </p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.galleryAtPrater.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.galleryAtPrater.year')
            }}</span>
            <p>{{ t('pages.prater.history.galleryAtPrater.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.postWallConstruction.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.postWallConstruction.year')
            }}</span>
            <p>{{ t('pages.prater.history.postWallConstruction.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.chance2000.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.chance2000.year')
            }}</span>
            <p>{{ t('pages.prater.history.chance2000.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.bastardClub.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.bastardClub.year')
            }}</span>
            <p>{{ t('pages.prater.history.bastardClub.text.p1') }}</p>
          </div>
        </article>

        <article class="history-entry">
          <div class="image-placeholder">ADD IMAGE</div>
          <div class="content">
            <h2>{{ t('pages.prater.history.praterGallery.title') }}</h2>
            <span class="year">{{
              t('pages.prater.history.praterGallery.year')
            }}</span>
            <p>{{ t('pages.prater.history.praterGallery.text.p1') }}</p>
            <p>{{ t('pages.prater.history.praterGallery.text.p2') }}</p>
          </div>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
  article {
    max-width: 80ch;
    margin: 0 auto;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  .history-entry {
    display: flex;
    flex-wrap: wrap-reverse;
    gap: var(--space-m);
    align-items: baseline;
  }

  .image-placeholder {
    flex: 0 0 300px;
    height: 150px;
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--space-s);
    min-width: 300px;
  }

  .year {
    font-weight: 600;
    color: var(--color-text-light);
  }
</style>
