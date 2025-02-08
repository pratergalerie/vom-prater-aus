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

  enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
  }

  const step = ref(0)
  function nextStep() {
    step.value++
  }
  function previousStep() {
    step.value--
  }

  const router = useRouter()

  const { t } = useI18n({ useScope: 'global' })

  const { story } = storeToRefs(useStoryStore())

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
              type: InputType.Text,
              label: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.label'
              ),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.placeholder'
              ),
            },
            {
              key: 'email',
              type: InputType.Email,
              label: t('pages.create.form.steps.authorInfo.inputs.email.label'),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.email.placeholder'
              ),
            },
          ],
        },
        {
          text: t('pages.create.form.steps.storyInfo.text'),
          inputs: [
            {
              key: 'title',
              type: InputType.Text,
              label: t('pages.create.form.steps.storyInfo.inputs.title.label'),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.title.placeholder'
              ),
            },
          ],
        },
      ],
      buttons: [
        {
          label: t('pages.create.form.buttons.next'),
          icon: 'mdi:arrow-right',
          callback: nextStep,
          checkStepToRender: () => step.value < form.value.steps.length - 1,
        },
        {
          label: t('pages.create.form.buttons.back'),
          icon: 'mdi:arrow-left',
          callback: previousStep,
          checkStepToRender: () => step.value > 0,
        },
        {
          label: t('pages.create.form.buttons.create'),
          icon: 'mdi:arrow-right',
          callback: openStoryEditor,
          checkStepToRender: () => step.value === form.value.steps.length - 1,
        },
      ],
    }
  })

  const currentStep = computed(() => form.value.steps[step.value])

  function openStoryEditor() {
    router.push({
      name: 'story-editor',
      params: { id: 'new' },
    })
  }

  function openInfoModal() {
    console.log('openInfoModal')
  }

  const termsAccepted = ref(false)

  type InputValues = {
    authorName: string
    email: string
    title: string
  }

  const inputValues = ref({
    authorName: '',
    email: '',
    title: '',
  }) as Ref<InputValues>

  watch(inputValues.value, (newValue) => {
    if (step.value === 0) {
      story.value.author.name = newValue.authorName
      story.value.author.email = newValue.email
    } else if (step.value === 1) {
      story.value.title = newValue.title
    }
  })
</script>

<template>
  <div
    ref="containerRef"
    class="content-wrapper"
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
            {{ currentStep.info.link }}
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
        </template>
      </template>
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
            @click="button.callback"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100dvh;
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
    font-family: var(--button-font);
    color: var(--black);
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;

    .info-icon {
      padding: 0;
    }
  }

  .terms-privacy-check {
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
</style>
