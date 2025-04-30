<script setup lang="ts">
  useHead({
    title: 'Vom Prater Aus - Write your own story',
    meta: [
      {
        name: 'description',
        content: 'Create your own Berliner Prater story',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
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

  const { story } = storeToRefs(useStoryStore())

  type InputValues = {
    authorName: string
    email: string
    title: string
    year: number
    locale: 'en' | 'de'
  }

  type FormInput = {
    key: keyof InputValues
    type: InputType
    label: string
    placeholder: string
    validationKey: keyof typeof validationRules
  }

  const inputValues = ref<InputValues>({
    authorName: '',
    email: '',
    title: '',
    year: new Date().getFullYear(),
    locale: 'de',
  })

  const termsAccepted = ref(false)
  const moderationAccepted = ref(false)

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

  watch(
    () => inputValues.value,
    (newValue) => {
      if (step.value === 0) {
        story.value.author.name = newValue.authorName
        story.value.author.email = newValue.email
      } else if (step.value === 1) {
        story.value.title = newValue.title
      }
    },
    { deep: true }
  )

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
            } as FormInput,
            {
              key: 'email',
              type: inputTypes.EMAIL,
              label: t('pages.create.form.steps.authorInfo.inputs.email.label'),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.email.placeholder'
              ),
              validationKey: 'email',
            } as FormInput,
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
            } as FormInput,
            {
              key: 'year',
              type: inputTypes.SELECT,
              label: t('pages.create.form.steps.storyInfo.inputs.year.label'),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.year.placeholder'
              ),
              validationKey: 'year',
            } as FormInput,
            {
              key: 'locale',
              type: inputTypes.SELECT,
              label: t(
                'pages.create.form.steps.storyInfo.inputs.language.label'
              ),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.language.placeholder'
              ),
            } as FormInput,
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
    const authorName = inputValues.value.authorName?.trim() || ''
    const email = inputValues.value.email?.trim() || ''
    const title = inputValues.value.title?.trim() || ''
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
    const author = story.value.author

    const authorData = await useAPI().createAuthor({
      name: author.name,
      email: author.email,
    })

    if (!authorData) {
      console.error('Error creating author:', authorData)
    } else {
      const authorId = authorData.id

      const storyData = await useAPI().createStory({
        author_id: authorId,
        created_at: new Date().toISOString(),
        id: '',
        modified_at: null,
        title: inputValues.value.title,
        year: 2025,
        locale_id: 'en',
        slug: inputValues.value.title.toLowerCase().replace(/\s+/g, '-'),
      })

      if (!storyData) {
        console.error('Error creating story:', storyData)
      } else {
        const router = useRouter()
        router.push({
          name: 'stories/edit',
          params: { id: storyData.id },
        })
      }
    }
  }

  function openInfoModal() {
    // TODO: implement modal logic
  }

  const getInputType = (type: InputType): 'text' | 'email' | 'password' => {
    return type as 'text' | 'email' | 'password'
  }

  const getTextInputValue = (key: 'authorName' | 'email' | 'title'): string => {
    return inputValues.value[key]
  }

  const setInputValue = (key: keyof InputValues, value: string | number) => {
    if (key === 'year') {
      inputValues.value[key] = Number(value)
    } else if (key === 'locale') {
      inputValues.value[key] = value as 'en' | 'de'
    } else {
      inputValues.value[key] = String(value)
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
  <div
    ref="containerRef"
    class="form-container"
  >
    <h1>{{ $t('pages.create.form.title') }}</h1>
    <form>
      <template v-if="currentStep">
        <p>{{ currentStep.text }}</p>
        <template v-if="currentStep.info">
          <button
            class="info-button"
            @click="openInfoModal"
          >
            <Icon
              name="mdi:information-outline"
              size="20px"
              mode="css"
              class="info-icon"
            />
            <span>{{ currentStep.info.link }}</span>
          </button>
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
                <NuxtLink to="/terms">{{
                  $t('pages.create.form.steps.authorInfo.info.termsOfUse')
                }}</NuxtLink>
              </template>
              <template #privacyPolicy>
                <NuxtLink to="/privacy">{{
                  $t('pages.create.form.steps.authorInfo.info.privacyPolicy')
                }}</NuxtLink>
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
                <NuxtLink to="/terms">{{
                  $t(
                    'pages.create.form.steps.authorInfo.info.moderationConditions'
                  )
                }}</NuxtLink>
              </template>
              <template #moderationConditions>
                <NuxtLink to="/privacy">{{
                  $t(
                    'pages.create.form.steps.authorInfo.info.moderationConditions'
                  )
                }}</NuxtLink>
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
          <BaseTextInput
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
              v-model="inputValues[input.key]"
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
            :disabled="button.disabled"
            @click.prevent="button.callback"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .form-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: calc(100dvh - var(--header-height) - 50px);
    padding-top: 50px;
    container-name: form-container;
    container-type: inline-size;
  }

  h1 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    line-height: 1.8rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .step-buttons-wrapper {
    display: grid;
    grid-template-areas: 'left right';
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    margin-top: 1rem;

    @container (max-width: 500px) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
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

  .info-button {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    width: fit-content;
    padding: 0;
    font-family: var(--font-button);
    color: var(--color-black);
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;

    .info-icon {
      padding: 0;
    }
  }

  .terms-privacy-check,
  .moderation-check {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    height: 30px;
    font-size: 0.8rem;

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
    gap: 1rem;
  }

  .select-wrapper {
    display: flex;
    gap: 1rem;
    width: 100%;
    margin-bottom: 1rem;

    @container (max-width: 500px) {
      gap: var(--padding-tablet);
    }

    @container (max-width: 768px) {
      gap: var(--padding-desktop);
    }
  }

  .select-input {
    width: 100%;
    max-width: 200px;
  }
</style>
