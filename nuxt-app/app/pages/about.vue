<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.about.title')}`,
  })
</script>

<template>
  <article>
    <section>
      <h1>{{ t('pages.about.title') }}</h1>

      <div class="content">
        <p>
          {{ t('pages.about.description') }}
        </p>

        <p class="acknowledgment">
          {{ t('pages.about.acknowledgment') }}
        </p>
      </div>

      <footer class="credits">
        <div class="credit-item">
          <h3>{{ t('pages.about.credits.idea') }}</h3>
          <p>{{ t('pages.about.credits.ideaPerson') }}</p>
        </div>
        <div class="credit-item">
          <h3>{{ t('pages.about.credits.implementation') }}</h3>
          <p>{{ t('pages.about.credits.implementationPeople') }}</p>
        </div>
      </footer>
    </section>
  </article>
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .acknowledgment {
    font-style: italic;
  }

  .credits {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    padding-top: var(--space-xl);
  }

  .credit-item {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
    gap: var(--space-xs);
  }
</style>
