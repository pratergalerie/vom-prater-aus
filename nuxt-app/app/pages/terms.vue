<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: t('pages.terms.title'),
    meta: [
      {
        name: 'description',
        content: 'Terms of use for the Vom Prater aus digital archive',
      },
    ],
  })
</script>

<template>
  <article>
    <h1>{{ t('pages.terms.title') }}</h1>

    <div class="intro">
      <p>{{ t('pages.terms.intro') }}</p>
      <p>{{ t('pages.terms.purpose') }}</p>
      <p class="publishing-note">{{ t('pages.terms.publishing') }}</p>
    </div>

    <div class="terms-sections">
      <section class="term-section">
        <h2>{{ t('pages.terms.sections.registration.title') }}</h2>
        <div class="content">
          <ol>
            <li>{{ t('pages.terms.sections.registration.content.li1') }}</li>
            <li>{{ t('pages.terms.sections.registration.content.li2') }}</li>
          </ol>
          <p>{{ t('pages.terms.sections.registration.content.p1') }}</p>
          <ol start="3">
            <li>{{ t('pages.terms.sections.registration.content.li3') }}</li>
            <li>{{ t('pages.terms.sections.registration.content.li4') }}</li>
            <li>{{ t('pages.terms.sections.registration.content.li5') }}</li>
            <li>{{ t('pages.terms.sections.registration.content.li6') }}</li>
          </ol>
        </div>
      </section>

      <section class="term-section">
        <h2>{{ t('pages.terms.sections.obligations.title') }}</h2>
        <div class="content">
          <p>{{ t('pages.terms.sections.obligations.content.p1') }}</p>
          <ol>
            <li>
              {{ t('pages.terms.sections.obligations.content.li1') }}
              <ul>
                <li>
                  {{
                    t('pages.terms.sections.obligations.content.sublist.li1')
                  }}
                </li>
                <li>
                  {{
                    t('pages.terms.sections.obligations.content.sublist.li2')
                  }}
                </li>
                <li>
                  {{
                    t('pages.terms.sections.obligations.content.sublist.li3')
                  }}
                </li>
                <li>
                  {{
                    t('pages.terms.sections.obligations.content.sublist.li4')
                  }}
                </li>
                <li>
                  {{
                    t('pages.terms.sections.obligations.content.sublist.li5')
                  }}
                </li>
              </ul>
            </li>
            <li>{{ t('pages.terms.sections.obligations.content.li2') }}</li>
            <li>{{ t('pages.terms.sections.obligations.content.li3') }}</li>
            <li>{{ t('pages.terms.sections.obligations.content.li4') }}</li>
          </ol>
          <p>{{ t('pages.terms.sections.obligations.content.p1') }}</p>
        </div>
      </section>

      <section class="term-section">
        <h2>{{ t('pages.terms.sections.rightsTransfer.title') }}</h2>
        <div class="content">
          <p>{{ t('pages.terms.sections.rightsTransfer.content.p1') }}</p>
          <p>{{ t('pages.terms.sections.rightsTransfer.content.p2') }}</p>
          <p>{{ t('pages.terms.sections.rightsTransfer.content.p3') }}</p>
          <i18n-t
            keypath="pages.terms.sections.rightsTransfer.content.p4"
            tag="p"
          >
            <a
              class="dark"
              :href="`mailto:${t('pages.terms.sections.rightsTransfer.content.email')}`"
              >{{ $t('pages.terms.sections.rightsTransfer.content.email') }}</a
            >
          </i18n-t>
          <p>{{ t('pages.terms.sections.rightsTransfer.content.p5') }}</p>
        </div>
      </section>

      <section class="term-section">
        <h2>{{ t('pages.terms.sections.liability.title') }}</h2>
        <div class="content">
          <p>{{ t('pages.terms.sections.liability.content.p1') }}</p>
        </div>
      </section>

      <section class="term-section">
        <h2>{{ t('pages.terms.sections.duration.title') }}</h2>
        <div class="content">
          <ol>
            <li>{{ t('pages.terms.sections.duration.content.li1') }}</li>
            <i18n-t
              keypath="pages.terms.sections.duration.content.li2"
              tag="li"
            >
              <a
                class="dark"
                :href="`mailto:${t('pages.terms.sections.duration.content.email')}`"
                >{{ $t('pages.terms.sections.duration.content.email') }}</a
              >
            </i18n-t>
          </ol>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  a {
    font-family: var(--font-text);

    &:hover,
    &:focus {
      color: var(--color-brown);
    }
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .publishing-note {
    font-weight: bold;
  }

  .terms-sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  .term-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  ol,
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding-left: 2ch;
  }
</style>
