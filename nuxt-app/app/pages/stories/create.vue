<script setup lang="ts">
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'

  const localeOptions = [
    'sq', // Albanian
    'hy', // Armenian
    'az', // Azerbaijani
    'eu', // Basque
    'be', // Belarusian
    'bs', // Bosnian
    'bg', // Bulgarian
    'ca', // Catalan
    'hr', // Croatian
    'cs', // Czech
    'da', // Danish
    'de', // Deutsch (German)
    'nl', // Dutch
    'en', // English
    'et', // Estonian
    'fi', // Finnish
    'fr', // French
    'ka', // Georgian
    'el', // Greek
    'hu', // Hungarian
    'is', // Icelandic
    'ga', // Irish (Gaeilge)
    'it', // Italian
    'kk', // Kazakh
    'ku', // Kurdish
    'lv', // Latvian
    'lt', // Lithuanian
    'lb', // Luxembourgish
    'mk', // Macedonian
    'mt', // Maltese
    'no', // Norwegian
    'pl', // Polish
    'pt', // Portuguese
    'ro', // Romanian
    'ru', // Russian
    'sr', // Serbian
    'sk', // Slovak
    'sl', // Slovenian
    'es', // Spanish
    'sv', // Swedish
    'tr', // Turkish
    'uk', // Ukrainian
    'cy', // Welsh (Cymraeg)
  ] as const

  export type LanguageCode = (typeof localeOptions)[number]

  const validationSchema = toTypedSchema(
    z.object({
      termsPrivacy: z.literal(true, {
        message: 'pages.create.form.inputs.termsPrivacy.errors.required',
      }),
      moderation: z.literal(true, {
        message: 'pages.create.form.inputs.moderation.errors.required',
      }),
      authorName: z
        .string({
          message: 'pages.create.form.inputs.authorName.errors.required',
        })
        .nonempty({
          message: 'pages.create.form.inputs.authorName.errors.required',
        }),
      authorEmail: z
        .string({
          message: 'pages.create.form.inputs.authorEmail.errors.required',
        })
        .nonempty({
          message: 'pages.create.form.inputs.authorEmail.errors.required',
        })
        .email({
          message: 'pages.create.form.inputs.authorEmail.errors.invalid',
        }),
      storyTitle: z
        .string({
          message: 'pages.create.form.inputs.storyTitle.errors.required',
        })
        .nonempty({
          message: 'pages.create.form.inputs.storyTitle.errors.required',
        }),
      storyYear: z.coerce
        .number({
          message: 'pages.create.form.inputs.storyYear.errors.required',
        })
        .int({
          message: 'pages.create.form.inputs.storyYear.errors.invalid',
        })
        .min(1831, {
          message: 'pages.create.form.inputs.storyYear.errors.minMax',
        })
        .max(2017, {
          message: 'pages.create.form.inputs.storyYear.errors.minMax',
        }),
      storyLanguage: z
        .string({
          message: 'pages.create.form.inputs.storyLanguage.errors.required',
        })
        .nonempty({
          message: 'pages.create.form.inputs.storyLanguage.errors.required',
        }),
    })
  )

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
      storyLanguage: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2))
  })
</script>

<template>
  <section>
    <h1>{{ $t('pages.create.title') }}</h1>
    <p>{{ $t('pages.create.description') }}</p>

    <form @submit="onSubmit">
      <div class="checkboxes">
        <!-- Terms & Privacy -->
        <BaseCheckbox name="termsPrivacy">
          <template #label>
            <i18n-t
              keypath="pages.create.form.inputs.termsPrivacy.label.content"
              tag="span"
            >
              <template #termsOfUse>
                <NuxtLink
                  class="dark"
                  to="/terms"
                  :style="{ fontFamily: 'var(--font-text)' }"
                  >{{
                    $t('pages.create.form.inputs.termsPrivacy.label.termsOfUse')
                  }}</NuxtLink
                >
              </template>

              <template #privacyPolicy>
                <NuxtLink
                  class="dark"
                  to="/privacy"
                  :style="{ fontFamily: 'var(--font-text)' }"
                  >{{
                    $t(
                      'pages.create.form.inputs.termsPrivacy.label.privacyPolicy'
                    )
                  }}</NuxtLink
                >
              </template>
            </i18n-t>
          </template>
        </BaseCheckbox>

        <!-- Moderation  -->
        <BaseCheckbox name="moderation">
          <template #label>
            <i18n-t
              keypath="pages.create.form.inputs.moderation.label.content"
              tag="span"
            >
              <template #moderationConditions>
                <!-- TODO: Add model-->
                <NuxtLink
                  class="dark"
                  to="/"
                  :style="{ fontFamily: 'var(--font-text)' }"
                  >{{
                    $t(
                      'pages.create.form.inputs.moderation.label.moderationConditions'
                    )
                  }}</NuxtLink
                >
              </template>
            </i18n-t>
          </template>
        </BaseCheckbox>
      </div>

      <!-- Author Name + Email  -->
      <div class="name-email">
        <BaseInput
          name="authorName"
          type="text"
          :required="true"
          :label="$t('pages.create.form.inputs.authorName.label')"
          :placeholder="$t('pages.create.form.inputs.authorName.placeholder')"
        />
        <BaseInput
          name="authorEmail"
          type="email"
          :required="true"
          :label="$t('pages.create.form.inputs.authorEmail.label')"
          :placeholder="$t('pages.create.form.inputs.authorEmail.placeholder')"
        />
      </div>

      <div class="story">
        <!-- Story Title -->
        <BaseInput
          name="storyTitle"
          type="text"
          :required="true"
          :label="$t('pages.create.form.inputs.storyTitle.label')"
          :placeholder="$t('pages.create.form.inputs.storyTitle.placeholder')"
        />

        <!-- Story Year + Language -->
        <div class="year-language">
          <BaseInput
            name="storyYear"
            type="number"
            :required="true"
            :label="$t('pages.create.form.inputs.storyYear.label')"
            :placeholder="$t('pages.create.form.inputs.storyYear.placeholder')"
          />
          <BaseSelect
            name="storyLanguage"
            type="text"
            :required="true"
            :label="$t('pages.create.form.inputs.storyLanguage.label')"
            :placeholder="
              $t('pages.create.form.inputs.storyLanguage.placeholder')
            "
          >
            <template #options>
              <option
                v-for="locale in localeOptions"
                :key="locale"
                :value="locale"
              >
                {{ $t(`languages.${locale}`) }}
              </option>
            </template>
          </BaseSelect>
        </div>
      </div>

      <BaseButton
        type="secondary"
        variant="label-icon"
        icon="mdi:creation"
        class="button"
        :label="$t('pages.create.form.inputs.submitButton')"
      />
    </form>
  </section>
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);

    & button {
      align-self: end;
    }
  }

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .name-email {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(435px, 1fr));
    gap: var(--space-s);
  }

  .story {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .year-language {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(435px, 1fr));
    gap: var(--space-s);
  }
</style>
