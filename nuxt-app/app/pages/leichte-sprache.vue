<script setup lang="ts">
  const { t } = useI18n()

  useHead({
    title: `Vom Prater aus | ${t('pages.leichteSprache.title')}`,
  })
</script>

<template>
  <article>
    <h1>{{ $t('pages.leichteSprache.title') }}</h1>

    <div class="intro">
      <span class="welcome">{{ $t('pages.leichteSprache.intro.span') }}</span>

      <i18n-t
        keypath="pages.leichteSprache.intro.p"
        tag="p"
      >
        <br class="leichte-sprache-break" />
      </i18n-t>

      <section>
        <span>{{
          $t('pages.leichteSprache.intro.tableOfContents.title')
        }}</span>
        <ol>
          <li>
            <a
              className="dark"
              href="#projekt"
              >{{ $t('pages.leichteSprache.intro.tableOfContents.ol.li1') }}</a
            >
          </li>
          <li>
            <a
              className="dark"
              href="#geschichte"
              >{{ $t('pages.leichteSprache.intro.tableOfContents.ol.li2') }}</a
            >
          </li>
          <li>
            <a
              className="dark"
              href="#aufbau"
              >{{ $t('pages.leichteSprache.intro.tableOfContents.ol.li3') }}</a
            >
          </li>
          <li>
            <a
              className="dark"
              href="#barrierefreiheit"
              >{{ $t('pages.leichteSprache.intro.tableOfContents.ol.li4') }}</a
            >
          </li>
        </ol>
      </section>

      <i18n-t
        keypath="pages.leichteSprache.intro.capitoBerlin.p1"
        tag="p"
      >
        <br class="leichte-sprache-break" />
      </i18n-t>
    </div>

    <div class="sections">
      <!-- Section 1: Das Projekt -->
      <section id="projekt">
        <h2>{{ $t('pages.leichteSprache.project.h2') }}</h2>

        <div class="section-content">
          <i18n-t
            keypath="pages.leichteSprache.project.p1"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <ul>
            <li>
              <strong>{{
                $t('pages.leichteSprache.project.ul1.l1.title')
              }}</strong>
              <span class="structure-label">{{
                $t('pages.leichteSprache.project.ul1.l1.description')
              }}</span>
            </li>
            <li>
              <strong>{{
                $t('pages.leichteSprache.project.ul1.l2.title')
              }}</strong>
              <span class="structure-label">{{
                $t('pages.leichteSprache.project.ul1.l2.description')
              }}</span>
            </li>
            <li>
              <strong>{{
                $t('pages.leichteSprache.project.ul1.l3.title')
              }}</strong>
              <span class="structure-label">{{
                $t('pages.leichteSprache.project.ul1.l3.description')
              }}</span>
            </li>
          </ul>

          <i18n-t
            keypath="pages.leichteSprache.project.p2"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.project.p3"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.project.p4"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.project.p5"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.project.p6"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <ul>
            <li>{{ $t('pages.leichteSprache.project.ul2.li1') }}</li>
            <li>{{ $t('pages.leichteSprache.project.ul2.l2') }}</li>
            <li>{{ $t('pages.leichteSprache.project.ul2.l3') }}</li>
            <li>{{ $t('pages.leichteSprache.project.ul2.l4') }}</li>
            <li>{{ $t('pages.leichteSprache.project.ul2.l5') }}</li>
          </ul>

          <i18n-t
            keypath="pages.leichteSprache.project.p7"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <a
            href="#top"
            class="back-to-top"
            >{{ $t('pages.leichteSprache.project.a') }}</a
          >
        </div>
      </section>

      <!-- Section 2: Geschichte -->
      <section id="geschichte">
        <h2>{{ $t('pages.leichteSprache.history.h2') }}</h2>

        <div class="section-content">
          <i18n-t
            keypath="pages.leichteSprache.history.p1"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <section>
            <ol>
              <li>
                <a
                  className="dark"
                  href="#geschichte-1837"
                  >{{ $t('pages.leichteSprache.history.ul.l1') }}</a
                >
              </li>
              <li>
                <a
                  className="dark"
                  href="#geschichte-1940"
                  >{{ $t('pages.leichteSprache.history.ul.l2') }}</a
                >
              </li>
              <li>
                <a
                  className="dark"
                  href="#geschichte-1989"
                  >{{ $t('pages.leichteSprache.history.ul.l3') }}</a
                >
              </li>
            </ol>
          </section>

          <!-- 1837 -->
          <div
            id="geschichte-1837"
            class="history-period"
          >
            <h3>{{ $t('pages.leichteSprache.history.year1837.h3') }}</h3>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1837.section1.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section1.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section1.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1837.section2.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section2.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section2.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <CaptionImage
                class="history-image"
                :caption="$t('images.postkarte1895.caption')"
                src="imgs/postkarte1895.webp"
                :alt="
                  $t('pages.leichteSprache.history.year1837.section2.imageAlt')
                "
              />

              <aside class="image-description">
                <h5>
                  {{
                    $t(
                      'pages.leichteSprache.history.year1837.section2.imageDescription.title'
                    )
                  }}
                </h5>

                <i18n-t
                  keypath="pages.leichteSprache.history.year1837.section2.imageDescription.p1"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </aside>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1837.section3.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section3.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1837.section3.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.kaffeekueche1905.caption')"
              src="imgs/kaffeekueche1905.webp"
              :alt="
                $t('pages.leichteSprache.history.year1837.section3.imageAlt')
              "
            />

            <a
              href="#top"
              class="back-to-top"
              >{{ $t('pages.leichteSprache.history.year1837.a') }}</a
            >
          </div>

          <!-- 1940 -->
          <div
            id="geschichte-1940"
            class="history-period"
          >
            <h3>{{ $t('pages.leichteSprache.history.year1940.h3') }}</h3>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section1.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section1.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <CaptionImage
                class="history-image"
                :caption="$t('images.boxkampf1949.caption')"
                src="imgs/boxkampf1949.webp"
                :alt="
                  $t('pages.leichteSprache.history.year1940.section1.imageAlt')
                "
              />

              <aside class="image-description">
                <h5>
                  {{
                    $t(
                      'pages.leichteSprache.history.year1940.section1.imageDescription.title'
                    )
                  }}
                </h5>

                <i18n-t
                  keypath="pages.leichteSprache.history.year1940.section1.imageDescription.p1"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>

                <i18n-t
                  keypath="pages.leichteSprache.history.year1940.section1.imageDescription.p2"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </aside>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section2.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section2.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section2.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <CaptionImage
                class="history-image"
                :caption="$t('images.defaKastanienallee1954.caption')"
                src="imgs/defaKastanienallee1954.webp"
                :alt="
                  $t('pages.leichteSprache.history.year1940.section2.imageAlt')
                "
              />

              <aside class="image-description">
                <h5>
                  {{
                    $t(
                      'pages.leichteSprache.history.year1940.section2.imageDescription.title'
                    )
                  }}
                </h5>

                <i18n-t
                  keypath="pages.leichteSprache.history.year1940.section2.imageDescription.p1"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>

                <i18n-t
                  keypath="pages.leichteSprache.history.year1940.section2.imageDescription.p2"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </aside>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section3.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section3.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section3.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.arbeitenAufbauwerk1958.caption')"
              src="imgs/arbeitenAufbauwerk1958.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section3.imageAlt')
              "
            />

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section4.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section4.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section4.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <ul>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section4.ul.li1')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section4.ul.li2')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section4.ul.li3')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section4.ul.li4')
                  }}
                </li>
              </ul>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.skatspielerwiederoeffnung1960.caption')"
              src="imgs/skatspielerwiederoeffnung1960.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section4.imageAlt')
              "
            />

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section5.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section5.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section5.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section5.p3"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section6.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section6.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <ul>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li1')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li2')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li3')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li4')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li5')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li6')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1940.section6.ul.li7')
                  }}
                </li>
              </ul>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section6.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.tanzPratergarten1980.caption')"
              src="imgs/tanzPratergarten1980.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section6.imageAlt1')
              "
            />
            <CaptionImage
              class="history-image"
              :caption="$t('images.konzertKindertag1986.caption')"
              src="imgs/konzertKindertag1986.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section6.imageAlt2')
              "
            />

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section7.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section7.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section7.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.skipPahlerProblemAusstellung2021.caption')"
              src="imgs/skipPahlerProblemAusstellung2021.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section7.imageAlt')
              "
            />

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1940.section8.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1940.section8.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.gatAusstellung1979.caption')"
              src="imgs/gatAusstellung1979.webp"
              :alt="
                $t('pages.leichteSprache.history.year1940.section8.imageAlt')
              "
            />

            <a
              href="#top"
              class="back-to-top"
              >{{ $t('pages.leichteSprache.history.year1940.a') }}</a
            >
          </div>

          <!-- 1989 -->
          <div
            id="geschichte-1989"
            class="history-period"
          >
            <h3>{{ $t('pages.leichteSprache.history.year1989.h3') }}</h3>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1989.section1.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section1.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section1.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section1.p3"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section1.p4"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1989.section2.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section2.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section2.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section2.p3"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <ul>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1989.section2.ul.li1')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1989.section2.ul.li2')
                  }}
                </li>
                <li>
                  {{
                    $t('pages.leichteSprache.history.year1989.section2.ul.li3')
                  }}
                </li>
              </ul>
            </div>

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1989.section3.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section3.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <p>
                <i18n-t
                  keypath="pages.leichteSprache.history.year1989.section3.p2.text"
                  tag="span"
                >
                  <template #lb>
                    <br class="leichte-sprache-break" />
                  </template>

                  <template #b>
                    <strong>{{
                      $t('pages.leichteSprache.history.year1989.section3.p2.b')
                    }}</strong>
                  </template>

                  <template #i>
                    <strong>{{
                      $t('pages.leichteSprache.history.year1989.section3.p2.i')
                    }}</strong>
                  </template>

                  <template #p>
                    <strong>{{
                      $t('pages.leichteSprache.history.year1989.section3.p2.p')
                    }}</strong>
                  </template>

                  <template #c>
                    <strong>{{
                      $t('pages.leichteSprache.history.year1989.section3.p2.c')
                    }}</strong>
                  </template>
                </i18n-t>
              </p>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section3.p3"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.flyerFemmesWithFatalBreaks2000.caption')"
              src="imgs/flyerFemmesWithFatalBreaks2000.webp"
              :alt="
                $t('pages.leichteSprache.history.year1989.section3.imageAlt')
              "
            />

            <div class="history-subsection">
              <h4>
                {{ $t('pages.leichteSprache.history.year1989.section4.h4') }}
              </h4>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section4.p1"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>

              <i18n-t
                keypath="pages.leichteSprache.history.year1989.section4.p2"
                tag="p"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <CaptionImage
              class="history-image"
              :caption="$t('images.gaestebuchJetztHier2005.caption')"
              src="imgs/gaestebuchJetztHier2005.webp"
              :alt="
                $t('pages.leichteSprache.history.year1989.section4.imageAlt')
              "
            />

            <a
              href="#top"
              class="back-to-top"
              >{{ $t('pages.leichteSprache.history.year1989.a') }}</a
            >
          </div>
        </div>
      </section>

      <!-- Section 3: Aufbau -->
      <section id="aufbau">
        <h2>{{ $t('pages.leichteSprache.structure.h2') }}</h2>

        <div class="section-content">
          <!-- Header -->
          <div class="structure-subsection">
            <h3>{{ $t('pages.leichteSprache.structure.header.h3') }}</h3>

            <div class="structure-item">
              <span class="structure-label">{{
                $t('pages.leichteSprache.structure.header.logo.span1')
              }}</span>

              <NuxtImg
                class="structure-image"
                src="logos/vom-prater-aus.svg"
                :alt="$t('pages.leichteSprache.structure.header.logo.imageAlt')"
              />

              <i18n-t
                keypath="pages.leichteSprache.structure.header.logo.span2"
                tag="span"
              >
                <br class="leichte-sprache-break" />
              </i18n-t>
            </div>

            <div class="structure-item">
              <span class="structure-label">{{
                $t('pages.leichteSprache.structure.header.menu.span1')
              }}</span>

              <NuxtImg
                class="structure-image"
                src="imgs/menu-example.png"
                :alt="$t('pages.leichteSprache.structure.header.menu.imageAlt')"
              />

              <p>
                {{ $t('pages.leichteSprache.structure.header.menu.span2') }}
              </p>

              <ul>
                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l1.title')
                  }}</strong>

                  <span class="structure-label">{{
                    $t(
                      'pages.leichteSprache.structure.header.menu.ul.l1.description'
                    )
                  }}</span>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l2.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l2.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l3.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l3.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l4.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l4.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l5.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l5.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l6.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l6.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l7.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l7.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l8.title')
                  }}</strong>
                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l8.description.text"
                    tag="span"
                  >
                    <template #lb>
                      <br class="leichte-sprache-break" />
                    </template>

                    <template #link>
                      <a href="#barrierefreiheit">{{
                        $t(
                          'pages.leichteSprache.structure.header.menu.ul.l8.description.link'
                        )
                      }}</a>
                    </template>
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t('pages.leichteSprache.structure.header.menu.ul.l9.title')
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l9.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t(
                      'pages.leichteSprache.structure.header.menu.ul.l10.title'
                    )
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l10.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t(
                      'pages.leichteSprache.structure.header.menu.ul.l11.title'
                    )
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l11.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t(
                      'pages.leichteSprache.structure.header.menu.ul.l12.title'
                    )
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l12.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>

                <li>
                  <strong>{{
                    $t(
                      'pages.leichteSprache.structure.header.menu.ul.l13.title'
                    )
                  }}</strong>

                  <i18n-t
                    class="structure-label"
                    keypath="pages.leichteSprache.structure.header.menu.ul.l13.description"
                    tag="span"
                  >
                    <br class="leichte-sprache-break" />
                  </i18n-t>
                </li>
              </ul>
            </div>
          </div>

          <!-- Homepage -->
          <div class="structure-subsection">
            <h3>{{ $t('pages.leichteSprache.structure.homepage.h3') }}</h3>

            <i18n-t
              keypath="pages.leichteSprache.structure.homepage.p"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <span class="structure-label">{{
              $t('pages.leichteSprache.structure.homepage.span')
            }}</span>

            <ul>
              <li>
                <strong>{{
                  $t('pages.leichteSprache.structure.homepage.ul.l1.title')
                }}</strong>

                <span class="structure-label">{{
                  $t('pages.leichteSprache.structure.homepage.ul.l1.span')
                }}</span>

                <NuxtImg
                  class="structure-image structure-image-button"
                  src="imgs/button-1-example.png"
                  :alt="
                    $t('pages.leichteSprache.structure.homepage.ul.l1.imageAlt')
                  "
                />

                <i18n-t
                  keypath="pages.leichteSprache.structure.homepage.ul.l1.p"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </li>
              <li>
                <strong>{{
                  $t('pages.leichteSprache.structure.homepage.ul.l2.title')
                }}</strong>
                <span class="structure-label">{{
                  $t('pages.leichteSprache.structure.homepage.ul.l2.span')
                }}</span>

                <NuxtImg
                  class="structure-image structure-image-button"
                  src="imgs/button-2-example.png"
                  :alt="
                    $t('pages.leichteSprache.structure.homepage.ul.l2.imageAlt')
                  "
                />

                <i18n-t
                  keypath="pages.leichteSprache.structure.homepage.ul.l2.p"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </li>
              <li>
                <strong>{{
                  $t('pages.leichteSprache.structure.homepage.ul.l3.title')
                }}</strong>
                <span class="structure-label">{{
                  $t('pages.leichteSprache.structure.homepage.ul.l3.span')
                }}</span>

                <NuxtImg
                  class="structure-image structure-image-button"
                  src="imgs/button-3-example.png"
                  :alt="
                    $t('pages.leichteSprache.structure.homepage.ul.l3.imageAlt')
                  "
                />

                <i18n-t
                  keypath="pages.leichteSprache.structure.homepage.ul.l3.p"
                  tag="p"
                >
                  <br class="leichte-sprache-break" />
                </i18n-t>
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="structure-subsection">
            <h3>{{ $t('pages.leichteSprache.structure.footer.h3') }}</h3>

            <i18n-t
              keypath="pages.leichteSprache.structure.footer.p1"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <i18n-t
              keypath="pages.leichteSprache.structure.footer.p2"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>
          </div>

          <!-- Zoom instruction -->
          <div class="structure-subsection">
            <h3>
              {{ $t('pages.leichteSprache.structure.zoomInstruction.h3') }}
            </h3>

            <i18n-t
              keypath="pages.leichteSprache.structure.zoomInstruction.p"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>
          </div>
        </div>
      </section>

      <!-- Section 4: Barrierefreiheit -->
      <section id="barrierefreiheit">
        <h2>{{ $t('pages.leichteSprache.accessibility.h2') }}</h2>

        <div class="section-content">
          <i18n-t
            keypath="pages.leichteSprache.accessibility.p1"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.accessibility.p2"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.accessibility.p3"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <i18n-t
            keypath="pages.leichteSprache.accessibility.p4"
            tag="p"
          >
            <br class="leichte-sprache-break" />
          </i18n-t>

          <ul>
            <i18n-t
              keypath="pages.leichteSprache.accessibility.ul.li1"
              tag="li"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <i18n-t
              keypath="pages.leichteSprache.accessibility.ul.l2"
              tag="li"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <i18n-t
              keypath="pages.leichteSprache.accessibility.ul.l3"
              tag="li"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>
          </ul>

          <div class="accessibility-subsection">
            <h3>{{ $t('pages.leichteSprache.accessibility.problems.h3') }}</h3>

            <i18n-t
              keypath="pages.leichteSprache.accessibility.problems.p1"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <div class="problems-contact">
              <span>
                {{
                  $t('pages.leichteSprache.accessibility.problems.phone.text')
                }}
              </span>
              <a
                class="dark"
                :href="`tel:${t('pages.leichteSprache.accessibility.problems.phone.number')}`"
                >{{
                  $t('pages.leichteSprache.accessibility.problems.phone.number')
                }}</a
              >
            </div>
            <div class="problems-contact">
              <span
                >{{
                  $t('pages.leichteSprache.accessibility.problems.email.text')
                }}
              </span>
              <a
                class="dark"
                :href="`mailto:${t('pages.leichteSprache.accessibility.problems.email.address')}`"
                >{{
                  $t(
                    'pages.leichteSprache.accessibility.problems.email.address'
                  )
                }}</a
              >
            </div>
          </div>

          <div class="accessibility-subsection">
            <h3>
              {{ $t('pages.leichteSprache.accessibility.arbitration.h3') }}
            </h3>

            <i18n-t
              keypath="pages.leichteSprache.accessibility.arbitration.p1"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <i18n-t
              keypath="pages.leichteSprache.accessibility.arbitration.p2"
              tag="p"
            >
              <br class="leichte-sprache-break" />
            </i18n-t>

            <address>
              <span>{{
                $t(
                  'pages.leichteSprache.accessibility.arbitration.contact.organization'
                )
              }}</span>
              <span>{{
                $t(
                  'pages.leichteSprache.accessibility.arbitration.contact.department'
                )
              }}</span>
              <span>{{
                $t(
                  'pages.leichteSprache.accessibility.arbitration.contact.street'
                )
              }}</span>
              <span>{{
                $t(
                  'pages.leichteSprache.accessibility.arbitration.contact.city'
                )
              }}</span>
              <i18n-t
                keypath="pages.leichteSprache.accessibility.arbitration.contact.phone.text"
                tag="span"
              >
                <a
                  class="dark"
                  :href="`tel:${t('pages.leichteSprache.accessibility.arbitration.contact.phone.number')}`"
                  >{{
                    $t(
                      'pages.leichteSprache.accessibility.arbitration.contact.phone.number'
                    )
                  }}</a
                >
              </i18n-t>
              <i18n-t
                keypath="pages.leichteSprache.accessibility.arbitration.contact.email.text"
                tag="span"
              >
                <a
                  class="dark"
                  :href="`mailto:${t('pages.leichteSprache.accessibility.arbitration.contact.email.address')}`"
                  >{{
                    $t(
                      'pages.leichteSprache.accessibility.arbitration.contact.email.address'
                    )
                  }}</a
                >
              </i18n-t>
            </address>

            <a
              href="#top"
              class="back-to-top"
              >{{ $t('pages.leichteSprache.accessibility.arbitration.a') }}</a
            >
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
  .leichte-sprache-break {
    @media (max-width: 390px) {
      display: none;
    }
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .welcome {
    font-size: var(--step-1);
    font-weight: bold;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding-left: var(--space-m);
    margin: 0;
  }

  ol {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    margin: 0;
  }

  .sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-l-xl);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
    scroll-margin-top: 120px;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .history-period {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    margin-top: var(--space-m);
    scroll-margin-top: 120px;
  }

  .history-subsection {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .history-image {
    max-width: 70ch;
  }

  .image-description {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    width: fit-content;
    padding: var(--space-s-m);
    margin-top: var(--space-xs);
    background-color: var(--color-white);
    border-left: 3px solid var(--color-black);

    & h5 {
      margin: 0 0 var(--space-xs);
      font-size: 0.95em;
    }
  }

  .structure-subsection {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
  }

  .structure-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .structure-label {
    display: block;
  }

  .structure-image {
    width: 85%;
    max-width: 200px;
    padding: var(--space-xs);
    margin: var(--space-s) 0;
    border-radius: 12px;
    box-shadow: 2px 2px 20px var(--color-grey);
  }

  .structure-image-button {
    max-width: 400px;
  }

  .problems-contact {
    display: flex;
    flex-direction: column;
  }

  .accessibility-subsection {
    display: flex;
    flex-direction: column;
    gap: var(--space-s-m);
    margin-top: var(--space-m);
  }

  .back-to-top {
    display: inline-block;
    margin-top: var(--space-s);
    text-decoration: underline;
  }

  a {
    font-family: var(--font-text);
    color: var(--color-black);
    text-decoration: underline;

    &:hover,
    &:focus {
      color: var(--color-brown);
    }
  }

  strong {
    font-weight: 600;
  }

  h3 {
    margin-top: var(--space-s);
  }

  h4 {
    margin-top: var(--space-xs);
  }

  address {
    font-style: unset;

    & span {
      display: block;

      &:nth-child(1) {
        font-weight: 600;
      }
    }
  }
</style>
