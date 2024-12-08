<script setup lang="ts">
  const containerRef = ref<HTMLElement | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rellaxInstance = useRellax('.rellax', {
    wrapper: containerRef.value,
    center: true,
    vertical: true,
    horizontal: false,
  })
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
  >
    <section class="section stories">
      <picture>
        <NuxtImg
          src="/imgs/prater/prater15.jpeg"
          alt="Berliner Prater"
          class="photo rellax"
          data-rellax-speed="1"
        />
      </picture>
      <span class="quote">
        "Kann diese Nachmittage im Prater nur empfehlen!"
      </span>
      <a
        href=""
        class="highlight"
      >
        Sonnige Nachmittage im Biergarten (2001)</a
      >
      <div class="text-block stories">
        <h1>{{ $t('pages.home.sections.stories.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.stories.text') }}
        </p>
      </div>
      <BaseButton
        :label="$t('pages.home.sections.stories.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        class="rellax"
        data-rellax-speed="-1"
      />
    </section>

    <section class="section prater">
      <picture>
        <NuxtImg
          src="/imgs/prater/prater11.jpeg"
          alt="Berliner Prater"
          class="photo rellax"
          data-rellax-speed="0.5"
        />
      </picture>
      <div class="text-block prater">
        <h1>{{ $t('pages.home.sections.prater.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.prater.text') }}
        </p>
      </div>
      <BaseButton
        class="rellax"
        :label="$t('pages.home.sections.prater.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        data-rellax-speed="0"
      />
    </section>

    <section class="section create">
      <div class="text-block create">
        <h1>{{ $t('pages.home.sections.create.title') }}</h1>
        <picture>
          <NuxtImg
            src="/imgs/prater/prater8.jpeg"
            alt="Berliner Prater"
            class="photo rellax"
            data-rellax-speed="-0.2"
          />
        </picture>
        <p>
          {{ $t('pages.home.sections.create.text') }}
        </p>
      </div>
      <BaseButton
        class="rellax"
        :label="$t('pages.home.sections.create.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
        data-rellax-speed="0.1"
      />
    </section>

    <div class="floating-shapes">
      <NuxtImg
        src="/svgs/floating-shapes/1.svg"
        alt="Floating shape 1"
        class="floating-shape shape-1 rellax"
        data-rellax-speed="3"
      />
      <NuxtImg
        src="/svgs/floating-shapes/2.svg"
        alt="Floating shape 2"
        class="floating-shape shape-2 rellax"
        data-rellax-speed="2"
      />
      <NuxtImg
        src="/svgs/floating-shapes/3.svg"
        alt="Floating shape 3"
        class="floating-shape shape-3 rellax"
        data-rellax-speed="-3"
      />
      <NuxtImg
        src="/svgs/floating-shapes/4.svg"
        alt="Floating shape 4"
        class="floating-shape shape-4 rellax"
        data-rellax-speed="-1"
      />
    </div>
  </div>
</template>

<style scoped>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: calc(100vh);
    padding-top: calc(var(--header-height) + var(--padding));
    margin: 0;

    picture {
      position: relative;
      display: grid;
      margin-right: calc(-1 * var(--padding));
      margin-left: calc(-1 * var(--padding));
    }

    .photo {
      grid-area: image;
      width: 100%;
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }

    &.stories {
      picture {
        grid-template-areas: '. image';
        grid-template-columns: 20% 1fr;
      }

      .quote {
        font-style: italic;
        line-height: 1.6rem;
      }

      a {
        align-self: flex-end;
        width: 60%;
        text-align: right;
      }
    }

    &.prater {
      picture {
        grid-template-areas: 'image .';
        grid-template-columns: 1fr 70px;
      }

      h1 {
        margin-left: -2.5rem;
      }
    }

    &.create {
      picture {
        grid-template-areas: 'image';
        grid-template-columns: 100%;
        margin-left: -95px;

        .photo {
          width: 100%;

          /* 
          ? For some reason this transform needs to be applied 
          ? in order to mix-blend-mode to work on Safari iOS? 
          */
          transform: translate3d(0, 0, 0);
        }
      }

      padding-bottom: calc(var(--header-height) + 3 * var(--padding));
    }

    .text-block {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0;

      h1 {
        font-size: 1.4rem;
        line-height: 1.8rem;
      }

      p {
        font-size: 1rem;
        line-height: 1.3rem;
      }

      &.stories {
        max-width: 80%;
      }

      &.prater {
        align-self: flex-end;
        max-width: 80%;
      }

      &.create {
        align-self: flex-end;
        max-width: 80%;

        h1,
        p {
          text-align: right;
        }
      }
    }
  }

  .floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100vw;
    height: 300vh;
    overflow-x: hidden;
  }

  .floating-shape {
    position: absolute;
    mix-blend-mode: multiply;

    &.shape-1 {
      top: 100px;
      left: -20px;
      width: 80%;
    }

    &.shape-2 {
      top: calc(50vh + 40px);
      right: 50px;
      width: 90%;
    }

    &.shape-3 {
      top: calc(100vh + 250px);
      right: -80px;
      width: 50%;
    }

    &.shape-4 {
      top: calc(200vh + 50px);
      left: -50px;
      width: 50%;
      transform: rotate(10deg);
    }
  }
</style>
