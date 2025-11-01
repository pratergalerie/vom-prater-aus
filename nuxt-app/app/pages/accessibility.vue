<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.accessibility.title')}`,
  })
</script>

<template>
  <article>
    <h1>{{ t('pages.accessibility.title') }}</h1>

    <div class="intro">
      <p>{{ t('pages.accessibility.p1') }}</p>
      <i18n-t
        keypath="pages.accessibility.p2.text"
        tag="p"
      >
        <a
          class="dark"
          :href="t('pages.accessibility.p2.link')"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t('pages.accessibility.p2.link') }}</a
        >
      </i18n-t>
    </div>

    <div class="sections">
      <section>
        <h2>{{ t('pages.accessibility.subtitle1') }}</h2>
        <ul>
          <li>{{ t('pages.accessibility.ul1.li1') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t('pages.accessibility.subtitle2') }}</h2>
        <ul>
          <li>{{ t('pages.accessibility.ul2.li1') }}</li>
          <li>{{ t('pages.accessibility.ul2.li2') }}</li>
          <li>{{ t('pages.accessibility.ul2.li3') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t('pages.accessibility.subtitle3') }}</h2>
        <ul>
          <li>{{ t('pages.accessibility.ul3.li1') }}</li>
          <li>{{ t('pages.accessibility.ul3.li2') }}</li>
          <li>{{ t('pages.accessibility.ul3.li3') }}</li>
          <li>{{ t('pages.accessibility.ul3.li4') }}</li>
          <li>{{ t('pages.accessibility.ul3.li5') }}</li>
          <li>{{ t('pages.accessibility.ul3.li6') }}</li>
          <li>{{ t('pages.accessibility.ul3.li7') }}</li>
          <li>{{ t('pages.accessibility.ul3.li8') }}</li>
          <li>{{ t('pages.accessibility.ul3.li9') }}</li>
          <li>{{ t('pages.accessibility.ul3.li10') }}</li>
          <li>{{ t('pages.accessibility.ul3.li11') }}</li>
          <li>{{ t('pages.accessibility.ul3.li12') }}</li>
          <li>{{ t('pages.accessibility.ul3.li13') }}</li>
          <li>{{ t('pages.accessibility.ul3.li14') }}</li>
          <li>{{ t('pages.accessibility.ul3.li15') }}</li>
          <li>{{ t('pages.accessibility.ul3.li16') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t('pages.accessibility.subtitle4') }}</h2>
        <p>{{ t('pages.accessibility.subtitle4Sub') }}</p>
        <ul class="non-accessible-list">
          <li>
            <b>{{ t('pages.accessibility.ul4.li1.title') }}</b>
            {{ t('pages.accessibility.ul4.li1.content') }}
          </li>
          <li>
            <b>{{ t('pages.accessibility.ul4.li2.title') }}</b>
            {{ t('pages.accessibility.ul4.li2.content') }}
          </li>
          <li>
            <b>{{ t('pages.accessibility.ul4.li3.title') }}</b>
            {{ t('pages.accessibility.ul4.li3.content') }}
          </li>
          <li>
            <b>{{ t('pages.accessibility.ul4.li4.title') }}</b>
            {{ t('pages.accessibility.ul4.li4.content') }}
          </li>
        </ul>
      </section>

      <section>
        <h2>{{ t('pages.accessibility.subtitle5') }}</h2>
        <address class="contact-info">
          {{ t('pages.accessibility.contact.name') }}<br />
          {{ t('pages.accessibility.contact.organization') }}<br />
          {{ t('pages.accessibility.contact.department') }}<br />
          {{ t('pages.accessibility.contact.unit') }}<br />
          {{ t('pages.accessibility.contact.phone') }}<br />
          <a
            class="dark"
            :href="`mailto:${t('pages.accessibility.contact.email')}`"
            >{{ t('pages.accessibility.contact.email') }}</a
          >
        </address>
      </section>

      <section>
        <h2>{{ t('pages.accessibility.subtitle6') }}</h2>
        <p>{{ t('pages.accessibility.contactCommissioner.intro') }}</p>
        <div class="commissioner-links">
          <a
            class="dark"
            :href="t('pages.accessibility.contactCommissioner.formLink.url')"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t('pages.accessibility.contactCommissioner.formLink.text') }}</a
          >
          <a
            class="dark"
            :href="t('pages.accessibility.contactCommissioner.infoLink.url')"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t('pages.accessibility.contactCommissioner.infoLink.text') }}</a
          >
        </div>
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

  a {
    font-family: var(--font-text);
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

  ul {
    padding-left: var(--space-m);

    & li {
      padding-left: var(--space-xs);
    }
  }

  .non-accessible-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .commissioner-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }
</style>
