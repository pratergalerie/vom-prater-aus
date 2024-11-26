<script setup lang="ts"></script>

<template>
  <div class="content-wrapper">
    <section class="section stories">
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
      />
    </section>
    <section class="section prater">
      <div class="text-block prater">
        <h1>{{ $t('pages.home.sections.prater.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.prater.text') }}
        </p>
      </div>
      <BaseButton
        :label="$t('pages.home.sections.prater.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
      />
    </section>
    <section class="section create">
      <div class="text-block create">
        <h1>{{ $t('pages.home.sections.create.title') }}</h1>
        <p>
          {{ $t('pages.home.sections.create.text') }}
        </p>
      </div>
      <BaseButton
        :label="$t('pages.home.sections.create.button')"
        icon="arrow-right"
        type="primary"
        variant="label-icon"
      />
    </section>
  </div>
</template>

<style scoped>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 300px;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 100%;
    margin: 0;
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
</style>
