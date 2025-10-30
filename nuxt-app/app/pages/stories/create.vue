<script setup lang="ts">
  import slugify from '@sindresorhus/slugify'
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
        errorMap: (error) => {
          switch (error.code) {
            case 'invalid_literal': {
              return {
                message:
                  'pages.create.form.inputs.termsPrivacy.errors.required',
              }
            }
            default: {
              return { message: '' }
            }
          }
        },
      }),
      moderation: z.literal(true, {
        errorMap: (error) => {
          switch (error.code) {
            case 'invalid_literal': {
              return {
                message: 'pages.create.form.inputs.moderation.errors.required',
              }
            }
            default: {
              return { message: '' }
            }
          }
        },
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
          message: 'pages.create.form.inputs.storyYear.errors.min',
        })
        .max(2017, {
          message: 'pages.create.form.inputs.storyYear.errors.max',
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
    initialValues: { storyLanguage: '' },
  })

  const { post, pending, error } = useCreateStory()

  const onSubmit = handleSubmit(async (values) => {
    const {
      storyTitle: title,
      authorName,
      authorEmail,
      storyLanguage,
      storyYear: year,
    } = values

    const response = await post({
      title,
      authorName,
      authorEmail,
      slug: slugify(title),
      language: storyLanguage as LanguageCode,
      year,
    })

    if (response.type === 'ok') {
      const { uuid } = response.data
      await navigateTo({ path: `/draft-stories/${uuid}` })
    }
  })
</script>

<template>
  <section>
    <h1>{{ $t('pages.create.title') }}</h1>

    <form @submit="onSubmit">
      <!-- Author Email -->
      <BaseInput
        name="authorEmail"
        type="email"
        :required="true"
        :label="$t('pages.create.form.inputs.authorEmail.label')"
        :description="$t('pages.create.form.inputs.authorEmail.description')"
        :placeholder="$t('pages.create.form.inputs.authorEmail.placeholder')"
      />

      <!-- Author Name -->
      <BaseInput
        name="authorName"
        type="text"
        :required="true"
        :label="$t('pages.create.form.inputs.authorName.label')"
        :description="$t('pages.create.form.inputs.authorName.description')"
        :placeholder="$t('pages.create.form.inputs.authorName.placeholder')"
      />

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
          :description="$t('pages.create.form.inputs.storyYear.description')"
          :placeholder="$t('pages.create.form.inputs.storyYear.placeholder')"
        />
        <BaseSelect
          name="storyLanguage"
          :required="true"
          :label="$t('pages.create.form.inputs.storyLanguage.label')"
          :description="
            $t('pages.create.form.inputs.storyLanguage.description')
          "
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

      <div class="status-button">
        <!-- Status -->
        <p class="error">{{ error ? $t('pages.create.form.error') : '' }}</p>
        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="secondary"
          layout="label-icon"
          icon="mdi:creation"
          :disabled="pending"
          :label="$t('pages.create.form.inputs.submitButton')"
        />
      </div>
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
  }

  .checkboxes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
    gap: var(--space-s);
    justify-content: space-between;
  }

  .year-language {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    align-items: center;

    & > * {
      flex: 1 1 300px;
    }
  }

  .status-button {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    align-items: center;
    justify-content: space-between;

    & > * {
      flex: 1 1 300px;
    }
  }
</style>
