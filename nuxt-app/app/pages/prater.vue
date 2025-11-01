<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.prater.title')}`,
  })
</script>

<template>
  <section>
    <div class="intro">
      <h1>{{ t('pages.prater.title') }}</h1>
      <i18n-t
        keypath="pages.prater.intro.description.p1.text"
        tag="p"
      >
        <a
          class="dark"
          target="_blank"
          :href="t('pages.prater.intro.description.p1.link.url')"
          >{{ $t('pages.prater.intro.description.p1.link.text') }}</a
        >
      </i18n-t>
      <i18n-t
        keypath="pages.prater.intro.description.p2.text"
        tag="p"
      >
        <a
          class="dark"
          target="_blank"
          :href="t('pages.prater.intro.description.p2.link.url')"
          >{{ $t('pages.prater.intro.description.p2.link.text') }}</a
        >
      </i18n-t>
    </div>

    <div class="timeline">
      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.postkarte1895.caption')"
            src="imgs/postkarte1895.webp"
            :alt="$t('images.postkarte1895.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.beginnings.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.beginnings.year')
          }}</span>
          <p>{{ t('pages.prater.history.beginnings.text.p1') }}</p>
          <p>{{ t('pages.prater.history.beginnings.text.p2') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.kaffeekueche1905.caption')"
            src="imgs/kaffeekueche1905.webp"
            :alt="$t('images.kaffeekueche1905.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.coffeeKitchen.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.coffeeKitchen.year')
          }}</span>
          <p>{{ t('pages.prater.history.coffeeKitchen.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder"></div>
        <div class="content">
          <h2>{{ t('pages.prater.history.gardenLocations.title') }}</h2>
          <p>{{ t('pages.prater.history.gardenLocations.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.boxkampf1949.caption')"
            src="imgs/boxkampf1949.webp"
            :alt="$t('images.boxkampf1949.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.boxingMatches.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.boxingMatches.year')
          }}</span>
          <p>{{ t('pages.prater.history.boxingMatches.text.p1') }}</p>
          <p>{{ t('pages.prater.history.boxingMatches.text.p2') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.defaKastanienallee1954.caption')"
            src="imgs/defaKastanienallee1954.webp"
            :alt="$t('images.defaKastanienallee1954.alt')"
          />
        </div>
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

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.arbeitenAufbauwerk1958.caption')"
            src="imgs/arbeitenAufbauwerk1958.webp"
            :alt="$t('images.arbeitenAufbauwerk1958.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.renovation.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.renovation.year')
          }}</span>
          <p>{{ t('pages.prater.history.renovation.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.skatspielerwiederoeffnung1960.caption')"
            src="imgs/skatspielerwiederoeffnung1960.webp"
            :alt="$t('images.skatspielerwiederoeffnung1960.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.reopening.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.reopening.year')
          }}</span>
          <p>{{ t('pages.prater.history.reopening.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder"></div>
        <div class="content">
          <h2>{{ t('pages.prater.history.openAirStage.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.openAirStage.year')
          }}</span>
          <p>{{ t('pages.prater.history.openAirStage.text.p1') }}</p>
          <p>{{ t('pages.prater.history.openAirStage.text.p2') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.skipPahlerProblemAusstellung2021.caption')"
            src="imgs/skipPahlerProblemAusstellung2021.webp"
            :alt="$t('images.skipPahlerProblemAusstellung2021.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.firstGallery.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.firstGallery.year')
          }}</span>
          <p>{{ t('pages.prater.history.firstGallery.text.p1') }}</p>
          <p>{{ t('pages.prater.history.firstGallery.text.p2') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.konzertKindertag1986.caption')"
            src="imgs/konzertKindertag1986.webp"
            :alt="$t('images.konzertKindertag1986.alt')"
          />
          <CaptionImage
            :caption="$t('images.tanzPratergarten1980.caption')"
            src="imgs/tanzPratergarten1980.webp"
            :alt="$t('images.tanzPratergarten1980.alt')"
          />
        </div>
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

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.gatAusstellung1979.caption')"
            src="imgs/gatAusstellung1979.webp"
            :alt="$t('images.gatAusstellung1979.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.galleryAtPrater.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.galleryAtPrater.year')
          }}</span>
          <p>{{ t('pages.prater.history.galleryAtPrater.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder"></div>
        <div class="content">
          <h2>{{ t('pages.prater.history.postWallConstruction.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.postWallConstruction.year')
          }}</span>
          <p>{{ t('pages.prater.history.postWallConstruction.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder"></div>
        <div class="content">
          <h2>{{ t('pages.prater.history.chance2000.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.chance2000.year')
          }}</span>
          <p>{{ t('pages.prater.history.chance2000.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.flyerFemmesWithFatalBreaks2000.caption')"
            src="imgs/flyerFemmesWithFatalBreaks2000.webp"
            :alt="$t('images.flyerFemmesWithFatalBreaks2000.alt')"
          />
        </div>
        <div class="content">
          <h2>{{ t('pages.prater.history.bastardClub.title') }}</h2>
          <span class="year">{{
            t('pages.prater.history.bastardClub.year')
          }}</span>
          <p>{{ t('pages.prater.history.bastardClub.text.p1') }}</p>
        </div>
      </article>

      <article>
        <div class="image-placeholder">
          <CaptionImage
            :caption="$t('images.gaestebuchJetztHier2005.caption')"
            src="imgs/gaestebuchJetztHier2005.webp"
            :alt="$t('images.gaestebuchJetztHier2005.alt')"
          />
        </div>
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
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xl);
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);

    a {
      font-family: var(--font-text);

      &:hover,
      &:focus {
        color: var(--color-brown);
      }
    }
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xl);
  }

  article {
    display: flex;
    flex-wrap: wrap-reverse;
    gap: var(--space-l);
    align-content: flex-start;
  }

  .image-placeholder {
    flex: 1 1 300px;
  }

  .content {
    display: flex;
    flex: 1 1 40ch;
    flex-direction: column;
    gap: var(--space-s);
  }

  .year {
    font-weight: 600;
    color: var(--color-text-light);
  }
</style>
