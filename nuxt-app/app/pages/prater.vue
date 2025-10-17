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
          <NuxtPicture
            src="imgs/anfaenge-prater.jpg"
            :alt="t('pages.prater.history.beginnings.imageAlt')"
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
          <NuxtPicture
            src="imgs/kaffeekueche.jpg"
            :alt="t('pages.prater.history.coffeeKitchen.imageAlt')"
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
          <NuxtPicture
            src="imgs/boxkaempfe.jpg"
            :alt="t('pages.prater.history.boxingMatches.imageAlt')"
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
          <NuxtPicture
            src="imgs/defa-kino.jpg"
            :alt="t('pages.prater.history.defaPremiere.imageAlt')"
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
          <NuxtPicture
            src="imgs/umbau-prater.jpg"
            :alt="t('pages.prater.history.renovation.imageAlt')"
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
          <NuxtPicture
            src="imgs/wiedereroeffnung.jpg"
            :alt="t('pages.prater.history.reopening.imageAlt')"
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
          <NuxtPicture
            src="imgs/erste-galerie.jpg"
            :alt="t('pages.prater.history.firstGallery.imageAlt')"
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
          <NuxtPicture
            src="imgs/kreiskulturhaus-1.jpg"
            :alt="t('pages.prater.history.districtCulturalCenter.imageAlt1')"
          />
          <NuxtPicture
            src="imgs/kreiskulturhaus-2.jpg"
            :alt="t('pages.prater.history.districtCulturalCenter.imageAlt2')"
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
          <NuxtPicture
            src="imgs/galerie-am-prater.jpg"
            :alt="t('pages.prater.history.galleryAtPrater.imageAlt')"
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
          <NuxtPicture
            src="imgs/bastard-club.jpg"
            :alt="t('pages.prater.history.bastardClub.imageAlt')"
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
          <NuxtPicture
            src="imgs/galerie-im-prater.jpg"
            :alt="t('pages.prater.history.praterGallery.imageAlt')"
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
