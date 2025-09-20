<script setup lang="ts">
  import type { PageLayout } from '~/types/frontend'

  useHead({
    title: 'Vom Prater aus - Write your own story',
    meta: [
      {
        name: 'description',
        content: 'Create your own Berliner Prater story',
      },
    ],
  })

  const inputTypes = {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    SELECT: 'select',
  } as const

  type InputType = 'text' | 'email' | 'password' | 'select'

  const step = ref(0)
  function nextStep() {
    step.value++
  }
  function previousStep() {
    step.value--
  }

  const { t } = useI18n({ useScope: 'global' })

  type StoryFormData = {
    authorName: string
    email: string
    title: string
    year: number
    locale: 'en' | 'de'
  }

  type StoryFormInput = {
    key: keyof StoryFormData
    type: InputType
    label: string
    placeholder: string
    validationKey: keyof typeof validationRules
  }

  const storyFormData = ref<StoryFormData>({
    authorName: '',
    email: '',
    title: '',
    year: new Date().getFullYear(),
    locale: 'de',
  })

  const termsAccepted = ref(false)
  const moderationAccepted = ref(false)
  const isCreating = ref(false)
  const error = ref<string | null>(null)

  const formErrors = ref({
    authorName: '',
    email: '',
    title: '',
    year: '',
    locale: '',
  })

  function handleValidationError(
    field: keyof typeof formErrors.value,
    error: string | null
  ) {
    formErrors.value[field] = error || ''
  }

  const form = computed(() => {
    return {
      title: t('pages.create.form.title'),
      steps: [
        {
          text: t('pages.create.form.steps.authorInfo.text'),
          info: {
            link: t('pages.create.form.steps.authorInfo.info.link'),
            checkbox: t('pages.create.form.steps.authorInfo.info.checkbox'),
          },
          inputs: [
            {
              key: 'authorName',
              type: inputTypes.TEXT,
              label: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.label'
              ),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.placeholder'
              ),
              validationKey: 'authorName',
            } as StoryFormInput,
            {
              key: 'email',
              type: inputTypes.EMAIL,
              label: t('pages.create.form.steps.authorInfo.inputs.email.label'),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.email.placeholder'
              ),
              validationKey: 'email',
            } as StoryFormInput,
          ],
        },
        {
          text: t('pages.create.form.steps.storyInfo.text'),
          inputs: [
            {
              key: 'title',
              type: inputTypes.TEXT,
              label: t('pages.create.form.steps.storyInfo.inputs.title.label'),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.title.placeholder'
              ),
              validationKey: 'title',
            } as StoryFormInput,
            {
              key: 'year',
              type: inputTypes.SELECT,
              label: t('pages.create.form.steps.storyInfo.inputs.year.label'),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.year.placeholder'
              ),
            } as StoryFormInput,
            {
              key: 'locale',
              type: inputTypes.SELECT,
              label: t(
                'pages.create.form.steps.storyInfo.inputs.language.label'
              ),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.language.placeholder'
              ),
            } as StoryFormInput,
          ],
        },
      ],
      buttons: [
        {
          label: t('pages.create.form.buttons.next'),
          icon: 'mdi:arrow-right',
          callback: nextStep,
          checkStepToRender: () => step.value < form.value.steps.length - 1,
          disabled: isFormDisabled.value,
        },
        {
          label: t('pages.create.form.buttons.back'),
          icon: 'mdi:arrow-left',
          callback: previousStep,
          checkStepToRender: () => step.value > 0,
          disabled: false,
        },
        {
          label: t('pages.create.form.buttons.create'),
          icon: 'mdi:creation',
          callback: createStory,
          checkStepToRender: () => step.value === form.value.steps.length - 1,
          disabled: isFormDisabled.value,
        },
      ],
    }
  })

  const isFormDisabled = computed(() => {
    const authorName = storyFormData.value.authorName?.trim() || ''
    const email = storyFormData.value.email?.trim() || ''
    const title = storyFormData.value.title?.trim() || ''
    const termsChecked = termsAccepted.value
    const moderationChecked = moderationAccepted.value
    const authorNameError = formErrors.value.authorName
    const emailError = formErrors.value.email
    const titleError = formErrors.value.title

    if (!form.value || !form.value?.steps) {
      return true
    }

    if (step.value === 0) {
      const conditions = {
        authorNameEmpty: !authorName,
        emailEmpty: !email,
        termsNotChecked: !termsChecked,
        moderationNotChecked: !moderationChecked,
        hasAuthorNameError: !!authorNameError,
        hasEmailError: !!emailError,
      }

      const isDisabled = Object.values(conditions).some(
        (condition) => condition
      )
      return isDisabled
    }

    if (step.value === 1) {
      const conditions = {
        titleEmpty: !title,
        hasTitleError: !!titleError,
      }

      const isDisabled = Object.values(conditions).some(
        (condition) => condition
      )
      return isDisabled
    }

    return true
  })

  const currentStep = computed(() => form.value.steps[step.value])

  async function createStory() {
    isCreating.value = true
    error.value = null

    try {
      // Create author first
      const createdAuthor = await useAPI().createAuthor({
        name: storyFormData.value.authorName,
        email: storyFormData.value.email,
      })

      if (!createdAuthor) {
        throw new Error('Failed to create author')
      }

      // Create story with the author ID
      const storyData = await useAPI().createStoryWithLocale(
        {
          author_id: createdAuthor.id,
          created_at: new Date().toISOString(),
          modified_at: null,
          title: storyFormData.value.title,
          year: storyFormData.value.year,
          slug: storyFormData.value.title.toLowerCase().replace(/\s+/g, '-'),
          status: 'draft',
          featured: false,
          quote: '',
          featured_image: '',
        },
        storyFormData.value.locale
      )

      if (!storyData?.id) {
        throw new Error('Failed to create story: No ID returned')
      }

      // Create the first page for the story
      const pageData = await useAPI().createPage({
        story_id: storyData.id,
        layout: 'image-over-text' as PageLayout,
        text: '',
        image: null,
        page_order: 1,
        created_at: new Date().toISOString(),
      })

      if (!pageData?.id) {
        throw new Error('Failed to create story page: No ID returned')
      }

      // Generate and store token for immediate access
      const { token } = await useAPI().verifyStoryPassword(storyData.id, null)
      if (import.meta.client) {
        sessionStorage.setItem(`story_token_${storyData.id}`, token)
      }

      const router = useRouter()
      await router.push(`/stories/edit/${storyData.id}`)
    } catch (err) {
      console.error('Error in createStory:', err)
      error.value = 'Failed to create story. Please try again.'
    } finally {
      isCreating.value = false
    }
  }

  const getInputType = (type: InputType): 'text' | 'email' | 'password' => {
    return type as 'text' | 'email' | 'password'
  }

  const getTextInputValue = (key: 'authorName' | 'email' | 'title'): string => {
    return storyFormData.value[key]
  }

  const setInputValue = (key: keyof StoryFormData, value: string | number) => {
    if (key === 'year') {
      storyFormData.value[key] = Number(value)
    } else if (key === 'locale') {
      storyFormData.value[key] = value as 'en' | 'de'
    } else {
      storyFormData.value[key] = String(value)
    }
  }

  const localeOptions = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
  ]

  const yearOptions = computed(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 200 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: currentYear - i,
    }))
  })
</script>

<template>
  <section>
    <h1>{{ $t('pages.create.form.title') }}</h1>
    <form>
      <template v-if="currentStep">
        <p>{{ currentStep.text }}</p>
        <template v-if="currentStep.info">
          <div class="terms-privacy-check">
            <BaseCheckbox
              id="checkbox"
              v-model="termsAccepted"
            />
            <i18n-t
              scope="global"
              keypath="pages.create.form.steps.authorInfo.info.checkbox"
              tag="span"
            >
              <template #termsOfUse>
                <NuxtLink
                  class="dark"
                  to="/terms"
                  >{{
                    $t('pages.create.form.steps.authorInfo.info.termsOfUse')
                  }}</NuxtLink
                >
              </template>
              <template #privacyPolicy>
                <NuxtLink
                  class="dark"
                  to="/privacy"
                  >{{
                    $t('pages.create.form.steps.authorInfo.info.privacyPolicy')
                  }}</NuxtLink
                >
              </template>
            </i18n-t>
          </div>
          <div class="moderation-check">
            <BaseCheckbox
              id="checkbox"
              v-model="moderationAccepted"
            />
            <i18n-t
              scope="global"
              keypath="pages.create.form.steps.authorInfo.info.moderationCheckbox"
              tag="span"
            >
              <template #moderation>
                <NuxtLink
                  t
                  class="dark"
                  o="/terms"
                  >{{
                    $t(
                      'pages.create.form.steps.authorInfo.info.moderationConditions'
                    )
                  }}</NuxtLink
                >
              </template>
              <template #moderationConditions>
                <NuxtLink
                  class="dark"
                  to="/privacy"
                  >{{
                    $t(
                      'pages.create.form.steps.authorInfo.info.moderationConditions'
                    )
                  }}</NuxtLink
                >
              </template>
            </i18n-t>
          </div>
        </template>
      </template>
      <div class="input-wrapper">
        <template
          v-for="(input, index) in currentStep?.inputs"
          :key="index"
        >
          <BaseInput
            v-if="
              input.type === inputTypes.TEXT || input.type === inputTypes.EMAIL
            "
            :id="input.key"
            :model-value="
              getTextInputValue(input.key as 'authorName' | 'email' | 'title')
            "
            :type="getInputType(input.type)"
            :label="input.label"
            :placeholder="input.placeholder"
            :validation-key="input.validationKey"
            @update:model-value="setInputValue(input.key, $event)"
            @update:error="(error) => handleValidationError(input.key, error)"
          />
        </template>
        <div class="select-wrapper">
          <template
            v-for="(input, index) in currentStep?.inputs"
            :key="index"
          >
            <BaseSelect
              v-if="input.type === inputTypes.SELECT"
              :id="input.key"
              v-model="storyFormData[input.key]"
              :label="input.label"
              :placeholder="input.placeholder"
              :validation-key="input.validationKey"
              :options="input.key === 'year' ? yearOptions : localeOptions"
              class="select-input"
              @update:error="(error) => handleValidationError(input.key, error)"
            />
          </template>
        </div>
      </div>
      <div class="step-buttons-wrapper">
        <div
          v-for="(button, index) in form.buttons"
          :key="index"
          class="button-wrapper"
          :class="{
            next: index < form.buttons.length - 1,
            back: index === 1,
            create: index === form.buttons.length - 1,
          }"
        >
          <BaseButton
            v-if="button.checkStepToRender()"
            type="secondary"
            variant="label-icon"
            :icon="button.icon"
            :label="button.label"
            class="step-button"
            :disabled="button.disabled || isCreating"
            @click.prevent="button.callback"
          />
        </div>
      </div>
    </form>
    <div
      v-if="error"
      class="error-message"
    >
      {{ error }}
    </div>
  </section>
</template>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-m-l);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    width: 80ch;
  }

  a {
    font-family: var(--font-text);
  }

  .step-buttons-wrapper {
    display: grid;
    grid-template-areas: 'left right';
    grid-template-columns: 1fr 1fr;
    gap: var(--space-s);
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .button-wrapper {
    width: 100%;

    &.next {
      grid-area: right;
    }

    &.back {
      grid-area: left;
    }

    &.create {
      grid-area: right;
    }
  }

  .step-button {
    width: 100%;
    height: 40px;

    &:deep(.button-label-icon) {
      font-size: 1rem;
    }
  }

  .terms-privacy-check,
  .moderation-check {
    display: flex;
    gap: var(--space-3xs);
    align-items: center;

    &:deep(label) {
      flex: 0;
    }

    a {
      margin: 0 0.2rem;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  .select-wrapper {
    display: flex;
    gap: 1rem;
    width: 100%;
  }

  .select-input {
    width: 100%;
    max-width: 200px;
  }

  .error-message {
    color: var(--color-red);
    text-align: center;
  }
</style>
