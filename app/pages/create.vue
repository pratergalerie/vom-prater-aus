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

  type Author = {
    id: number
    name: string
    email: string
  }

  type Story = {
    id: number
    title: string
    author: Author
    keywords: string[]
    createdAt: string
    modifiedAt?: string
    pages: {
      id: number
      text?: string
      image?: string
    }[]
  }

  const story = ref<Story>({
    id: 0,
    title: '',
    author: {
      id: 0,
      name: '',
      email: '',
    },
    keywords: [],
    pages: [],
    createdAt: new Date().toISOString(),
  })

  const step = ref(0)
  function nextStep() {
    step.value++
  }
  function previousStep() {
    step.value--
  }

  const router = useRouter()

  const { t } = useI18n()

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
              label: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.label'
              ),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.authorName.placeholder'
              ),
              model: story.value.title,
            },
            {
              key: 'email',
              label: t('pages.create.form.steps.authorInfo.inputs.email.label'),
              placeholder: t(
                'pages.create.form.steps.authorInfo.inputs.email.placeholder'
              ),
              model: story.value.author.email,
            },
          ],
        },
        {
          text: t('pages.create.form.steps.storyInfo.text'),
          inputs: [
            {
              key: 'title',
              label: t('pages.create.form.steps.storyInfo.inputs.title.label'),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.title.placeholder'
              ),
              model: story.value.title,
            },
            {
              key: 'keywords',
              label: t(
                'pages.create.form.steps.storyInfo.inputs.keywords.label'
              ),
              placeholder: t(
                'pages.create.form.steps.storyInfo.inputs.keywords.placeholder'
              ),
              model: story.value.keywords.join(', '),
            },
          ],
        },
      ],
      buttons: [
        {
          label: t('pages.create.form.buttons.next'),
          icon: 'arrow-right',
          callback: nextStep,
          checkStepToRender: () => step.value < form.value.steps.length - 1,
        },
        {
          label: t('pages.create.form.buttons.back'),
          icon: 'arrow-left',
          callback: previousStep,
          checkStepToRender: () => step.value > 0,
        },
        {
          label: t('pages.create.form.buttons.create'),
          icon: 'arrow-right',
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
          <label for="checkbox">
            <input
              id="checkbox"
              v-model="currentStep.info.checkbox"
              type="checkbox"
            />
            <i18n-t
              path="pages.create.form.steps.authorInfo.info.checkbox"
              tag="span"
            >
              <template #termsOfUse>
                <NuxtLink to="/terms-of-use">{{
                  $t('pages.create.form.steps.authorInfo.info.termsOfUse')
                }}</NuxtLink>
              </template>
              <template #privacyPolicy>
                <NuxtLink to="/privacy-policy">{{
                  $t('pages.create.form.steps.authorInfo.info.privacyPolicy')
                }}</NuxtLink>
              </template>
            </i18n-t>
          </label>
        </template>
        <BaseInput
          v-for="input in currentStep.inputs"
          :id="input.key"
          :key="input.key"
          v-model="input.model"
          :label="input.label"
          :placeholder="input.placeholder"
        />
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
    height: 100%;
    margin-top: var(--header-height);
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
    margin-top: 2rem;
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
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;

    .info-icon {
      padding: 0;
    }
  }
</style>
