<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: t('pages.privacy.title'),
    meta: [
      {
        name: 'description',
        content: 'Privacy policy for the Vom Prater Aus archive project',
      },
    ],
  })
</script>

<template>
  <article>
    <h1>{{ t('pages.privacy.title') }}</h1>

    <div class="intro">
      <p>{{ t('pages.privacy.intro') }}</p>
      <p>{{ t('pages.privacy.description') }}</p>
    </div>

    <div class="sections">
      <section>
        <h2>{{ t('pages.privacy.sections.responsible.title') }}</h2>
        <address class="contact-info">
          {{ t('pages.privacy.sections.responsible.content') }}
        </address>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.contact.title') }}</h2>
        <address class="contact-info">
          {{ t('pages.privacy.sections.contact.content') }}
        </address>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.purposes.title') }}</h2>
        <div class="subsections">
          <p>
            <strong>{{ t('pages.privacy.sections.purposes.consent') }}</strong>
          </p>
          <p>{{ t('pages.privacy.sections.purposes.contractual') }}</p>
          <p>
            {{ t('pages.privacy.sections.purposes.legitimateInterests') }}
          </p>
        </div>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.dataCategories.title') }}</h2>
        <p>{{ t('pages.privacy.sections.dataCategories.intro') }}</p>
        <ul>
          <li>{{ t('pages.privacy.sections.dataCategories.email') }}</li>
          <li>{{ t('pages.privacy.sections.dataCategories.username') }}</li>
          <li>{{ t('pages.privacy.sections.dataCategories.content') }}</li>
        </ul>
        <p>{{ t('pages.privacy.sections.dataCategories.processing') }}</p>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.recipients.title') }}</h2>
        <p>{{ t('pages.privacy.sections.recipients.content') }}</p>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.retention.title') }}</h2>
        <p>{{ t('pages.privacy.sections.retention.content') }}</p>
      </section>

      <section>
        <h2>{{ t('pages.privacy.sections.rights.title') }}</h2>
        <p>{{ t('pages.privacy.sections.rights.intro') }}</p>
        <ul class="rights-list">
          <li>{{ t('pages.privacy.sections.rights.withdrawal') }}</li>
          <li>{{ t('pages.privacy.sections.rights.access') }}</li>
          <li>{{ t('pages.privacy.sections.rights.rectification') }}</li>
          <li>{{ t('pages.privacy.sections.rights.erasure') }}</li>
          <li>{{ t('pages.privacy.sections.rights.portability') }}</li>
        </ul>
        <p>{{ t('pages.privacy.sections.rights.complaint') }}</p>
      </section>
    </div>
  </article>
</template>

<style scoped>
  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  .sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  .contact-info {
    font-style: normal;
    color: var(--color-text);
    white-space: pre-line;
  }

  .subsections {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  ul {
    padding-left: var(--space-m);

    & li {
      padding-left: var(--space-xs);
    }
  }

  .rights-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding-left: var(--space-m);

    & li {
      padding-left: var(--space-xs);
    }
  }
</style>
