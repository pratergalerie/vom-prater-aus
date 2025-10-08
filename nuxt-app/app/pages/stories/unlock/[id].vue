<script lang="ts" setup>
  useHead({
    title: 'Vom Prater aus - Unlock story',
    meta: [
      {
        name: 'description',
        content: 'Unlock your story',
      },
    ],
  })

  const route = useRoute()
  const router = useRouter()

  const storyId = route.params.id as string
  const password = ref('')
  const passwordError = ref('')
  const isLoading = ref(false)

  function handleValidationError(field: string, error: string | null) {
    if (error) {
      passwordError.value = error
    }
  }
</script>

<template>
  <div class="page-container">
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
        <BaseInput
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
          type="primary"
          variant="label-icon"
          icon="mdi:lock-open"
          :label="$t('pages.stories.unlock.submit')"
          :loading="isLoading"
          :disabled="!password || isLoading"
          @click="handlePasswordSubmit"
        />
        <BaseButton
          type="secondary"
          variant="label-icon"
          icon="mdi:arrow-left"
          :label="$t('pages.stories.unlock.back')"
          @click="router.push('/')"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
    height: calc(100vh - var(--header-height));
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;
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
  }
</style>
