<script lang="ts" setup>
  useHead({
    title: 'Vom Prater Aus - Unlock story',
    meta: [
      {
        name: 'description',
        content: 'Unlock your story',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
  })

  const route = useRoute()
  const router = useRouter()
  const api = useAPI()

  const storyId = route.params.id as string
  const password = ref('')
  const passwordError = ref('')
  const isLoading = ref(false)

  const { locale } = useI18n()

  // Get story details for display
  const { data: story } = await api.getStoryById(storyId)

  // Store the token in session storage
  function storeToken(token: string) {
    if (import.meta.client) {
      sessionStorage.setItem(`story_token_${storyId}`, token)
    }
  }

  async function handlePasswordSubmit() {
    if (!storyId || !password.value) return

    isLoading.value = true
    passwordError.value = ''

    try {
      const { token } = await api.verifyStoryPassword(storyId, password.value)
      storeToken(token)

      // Redirect back to the edit page
      await router.push(`/stories/edit/${storyId}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        passwordError.value =
          error.message ||
          'An error occurred while verifying the password, please try again.'
      } else {
        passwordError.value =
          'An error occurred while verifying the password, please try again.'
      }
      password.value = ''
    } finally {
      isLoading.value = false
    }
  }

  function handleValidationError(field: string, error: string | null) {
    if (error) {
      passwordError.value = error
    }
  }

  const emailSubject = computed(() => {
    return locale.value === 'de'
      ? `Passwort vergessen für ${story.value?.title}`
      : `Password forgotten for ${story.value?.title}`
  })

  const emailBody = computed(() => {
    return locale.value === 'de'
      ? `Hallo, ich bin der Autor der Geschichte "${story.value?.title}" und habe das Passwort leider verloren. Wäre es möglich, das Passwort wieder an die E-Mail-Adresse "${story.value?.author.email}" zu senden? Vielen Dank! Viele Grüße, ${story.value?.author.name}`
      : `Hello, I am the author of the story "${story.value?.title}" and have unfortunately lost the password. Would it be possible to send the password again to the email address "${story.value?.author.email}"? Thank you! Best regards, ${story.value?.author.name}`
  })
</script>

<template>
  <main>
    <div class="unlock-container">
      <h1>{{ $t('pages.stories.unlock.title') }}</h1>

      <form @submit.prevent="handlePasswordSubmit">
        <div
          v-if="story"
          class="story-info"
        >
          <p>{{ $t('pages.stories.unlock.text.p1') }}</p>
          <div class="story-details">
            <h2>{{ story.title }}</h2>
            <p>
              {{ $t('pages.stories.unlock.byAuthor') }}
              {{ story.author.name }}
            </p>
          </div>
          <p>
            {{ $t('pages.stories.unlock.text.p2') }}
          </p>
          <p>
            <i18n-t
              scope="global"
              keypath="pages.stories.unlock.text.p3"
              tag="span"
            >
              <template #contactUs>
                <a
                  :href="`mailto:vomprateraus@pratergalerie.de?subject=${emailSubject}&body=${emailBody}`"
                >
                  {{ $t('pages.stories.unlock.contactUs') }}
                </a>
              </template>
            </i18n-t>
          </p>
          <p>
            {{ $t('pages.stories.unlock.text.p4') }}
          </p>
        </div>
        <div class="input-group">
          <BaseTextInput
            id="story-password"
            :model-value="password"
            type="password"
            :label="$t('pages.stories.unlock.passwordLabel')"
            :placeholder="$t('pages.stories.unlock.passwordPlaceholder')"
            @update:model-value="password = $event"
            @update:error="(error) => handleValidationError('password', error)"
          />
          <p
            v-if="passwordError"
            class="error-message"
          >
            {{ passwordError }}
          </p>
        </div>

        <div class="actions">
          <BaseButton
            type="secondary"
            variant="label-icon"
            icon="mdi:arrow-left"
            :label="$t('pages.stories.unlock.back')"
            @click="router.back()"
          />
          <BaseButton
            type="primary"
            variant="label-icon"
            icon="mdi:lock-open"
            :label="$t('pages.stories.unlock.submit')"
            :loading="isLoading"
            :disabled="!password || isLoading"
            @click="handlePasswordSubmit"
          />
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
  main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: calc(100dvh - var(--header-height) - 50px);
    padding-top: 50px;
    container-name: page-container;
    container-type: inline-size;
  }

  h1 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    line-height: 1.8rem;
  }

  .story-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;

    h2 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
  }

  .input-group {
    max-width: 400px;
    margin: 1.5rem 0;
    text-align: left;
  }

  .error-message {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-red);
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    margin-top: 2rem;

    @container (min-width: 600px) {
      flex-direction: row;
      gap: 1rem;
      justify-content: space-between;
    }
  }
</style>
