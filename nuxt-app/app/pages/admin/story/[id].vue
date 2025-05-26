<script lang="ts" setup>
  import type { Database } from '~/types/supabase'

  useHead({
    title: 'Vom Prater Aus - Story Moderation',
    meta: [
      {
        name: 'description',
        content: 'Vom Prater Aus - Story Moderation',
      },
    ],
  })

  definePageMeta({
    layout: 'no-footer',
  })

  type Story = Omit<
    Database['public']['Tables']['stories']['Row'],
    'author_id' | 'locale_id'
  > & {
    author: {
      id: string
      name: string
      email: string
    }
    locale: {
      id: string
      code: string
      name: string
    }
    pages: Database['public']['Tables']['story_pages']['Row'][]
    createdAt: Date
    modifiedAt: Date
    status: 'draft' | 'submitted' | 'approved' | 'rejected'
  }

  const route = useRoute()
  const router = useRouter()
  const storyId = route.params.id as string

  const story = ref<Story | null>(null)
  const isSidebarOpen = ref(true)
  const isLoading = ref(true)
  const error = ref('')
  const showApproveDialog = ref(false)
  const showRejectDialog = ref(false)
  const quote = ref('')
  const isFeatured = ref(false)

  const currentPageIndex = ref(0)
  const isLightboxOpen = ref(false)
  const currentLightboxImage = ref('')
  const currentLightboxAlt = ref('')

  const rejectReason = ref('')

  const currentPage = computed(() => {
    return story.value?.pages[currentPageIndex.value]
  })

  const topImageMasksIndexes = computed(() => {
    if (story.value?.pages) {
      return story.value.pages.map(() => {
        return Math.floor(Math.random() * 3) + 1
      })
    }
    return []
  })

  const bottomImageMasksIndexes = computed(() => {
    if (story.value?.pages) {
      return story.value.pages.map(() => {
        return Math.floor(Math.random() * 3) + 1
      })
    }
    return []
  })

  const topImageMask = computed(() => {
    return `url(/svgs/story-page/image-masks/top/${topImageMasksIndexes.value[currentPageIndex.value]}.svg) top no-repeat`
  })

  const bottomImageMask = computed(() => {
    return `url(/svgs/story-page/image-masks/bottom/${bottomImageMasksIndexes.value[currentPageIndex.value]}.svg) bottom no-repeat`
  })

  const imageMask = computed(() => {
    return `${topImageMask.value}, ${bottomImageMask.value}, linear-gradient(black 0 0)`
  })

  function handleImageClick(imageSrc: string, alt: string) {
    currentLightboxImage.value = imageSrc
    currentLightboxAlt.value = alt
    isLightboxOpen.value = true
  }

  function handleLightboxClose() {
    isLightboxOpen.value = false
  }

  const api = useAPI()

  // Load story data
  async function loadStory() {
    try {
      isLoading.value = true
      const storyData = await api.getStoryByIdClient(storyId)
      if (storyData) {
        quote.value = storyData.quote || ''
        isFeatured.value = storyData.featured || false

        // Fetch story pages
        const pagesData = await api.getStoryPagesClient(storyId)
        if (pagesData) {
          // Transform the data to match the expected format
          story.value = {
            id: storyData.id,
            title: storyData.title,
            created_at: storyData.created_at,
            modified_at: storyData.modified_at,
            featured: storyData.featured,
            featured_image: storyData.featured_image,
            password: storyData.password,
            quote: storyData.quote,
            slug: storyData.slug,
            author: {
              id: storyData.author.id,
              name: storyData.author.name,
              email: storyData.author.email,
            },
            locale: {
              id: storyData.locale.id,
              code: storyData.locale.code,
              name: storyData.locale.name,
            },
            year: storyData.year,
            pages: pagesData,
            createdAt: new Date(storyData.created_at || new Date()),
            modifiedAt: new Date(storyData.modified_at || new Date()),
            status: storyData.status as
              | 'draft'
              | 'submitted'
              | 'approved'
              | 'rejected',
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update story status
  async function updateStoryStatus(newStatus: string) {
    try {
      const result = await $fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        body: {
          status: newStatus,
          featured: isFeatured.value,
          quote: quote.value,
        },
      })

      if (result.error) throw result.error

      // Close dialogs
      showApproveDialog.value = false
      showRejectDialog.value = false

      // Return to dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    }
  }

  // Handle approve/reject actions
  async function handleApprove() {
    await updateStoryStatus('approved')
  }

  async function handleReject() {
    await updateStoryStatus('rejected')
  }

  // Load story on mount
  onMounted(() => {
    loadStory()
  })
</script>

<template>
  <div class="admin-story-view">
    <div class="page-container">
      <div class="story-container">
        <div
          v-if="story"
          class="story-content"
        >
          <article
            class="story-page"
            :class="{ inverted: currentPage?.layout === 'text-over-image' }"
          >
            <div
              v-if="currentPageIndex === 0"
              class="story-title-image-container"
            >
              <NuxtImg
                :src="currentPage?.image || ''"
                :alt="story?.title || ''"
                @click="
                  handleImageClick(currentPage?.image || '', story?.title || '')
                "
              />
              <div
                class="story-title-container"
                :class="{
                  'top-aligned': currentPage?.layout === 'text-over-image',
                }"
              >
                <h1>{{ story.title }}</h1>
                <p>{{ story.year }}</p>
                <p>
                  Eine Geschichte von
                  <span class="author-name">{{ story.author.name }}</span>
                </p>
              </div>
            </div>

            <div
              v-if="
                currentPage?.image &&
                currentPageIndex > 0 &&
                currentPage?.layout.includes('image')
              "
              class="image-container"
            >
              <NuxtImg
                :src="currentPage?.image || ''"
                :alt="story?.title || ''"
                @click="
                  handleImageClick(currentPage?.image || '', story?.title || '')
                "
              />
            </div>

            <div
              v-if="currentPage?.text && currentPage?.layout.includes('text')"
              class="text-container"
            >
              <p>{{ currentPage.text }}</p>
            </div>
          </article>

          <div class="bottom-controls">
            <div class="pagination">
              <button
                v-for="(page, index) in story.pages"
                :key="page.id"
                @click="currentPageIndex = index"
              >
                <span :class="{ active: currentPageIndex === index }" />
              </button>
            </div>
          </div>
        </div>

        <Lightbox
          :is-open="isLightboxOpen"
          :image-src="currentLightboxImage"
          :image-alt="currentLightboxAlt"
          @close="handleLightboxClose"
        />
      </div>

      <AdminModerationSidebar
        v-model:is-open="isSidebarOpen"
        v-model:is-featured="isFeatured"
        v-model:quote="quote"
        :story="story"
        @approve="
          () => {
            console.log('approve')
            showApproveDialog = true
          }
        "
        @reject="
          () => {
            console.log('reject')
            showRejectDialog = true
          }
        "
        @return="router.push('/admin/dashboard')"
      />
    </div>

    <!-- Approve Dialog -->
    <BaseDialog
      v-model:is-open="showApproveDialog"
      title="Approve Story"
      :width="400"
      :height="200"
    >
      <p>
        Are you sure you want to approve this story? This will publish it on the
        website and notify the author.
      </p>
      <div class="modal-actions">
        <button @click="showApproveDialog = false">Cancel</button>
        <button
          class="approve-button"
          @click="handleApprove"
        >
          Approve
        </button>
      </div>
    </BaseDialog>

    <!-- Reject Dialog -->
    <BaseDialog
      v-model:is-open="showRejectDialog"
      title="Geschichte ablehnen"
      height="400px"
    >
      <p>
        Bist du dir sicher, dass du diese Geschichte ablehnen möchtest? Der
        Autor wird benachrichtigt.
      </p>
      <label for="reject-reason">
        Grund für Ablehnung:
        <textarea
          id="reject-reason"
          v-model="rejectReason"
          placeholder=""
          rows="8"
        />
      </label>

      <div class="modal-actions">
        <button @click="showRejectDialog = false">Abbrechen</button>
        <button
          class="reject-button"
          @click="handleReject"
        >
          Ablehnen
        </button>
      </div>
    </BaseDialog>
  </div>
</template>

<style scoped>
  .admin-story-view {
    height: calc(100dvh - var(--header-height));
  }

  .page-container {
    position: relative;
    width: 100%;
    max-width: var(--max-width);
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .story-container {
    width: 100%;
    height: 100%;
    padding-right: 320px; /* Add space for the sidebar */
    overflow-y: auto;
  }

  .story-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100dvh - var(--header-height) - var(--padding-mobile));

    @media screen and (min-width: 768px) {
      height: calc(100dvh - var(--header-height) - var(--padding-tablet));
    }

    @media screen and (min-width: 1024px) {
      height: calc(100dvh - var(--header-height) - var(--padding-desktop));
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story-page {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    min-height: 0; /* Important for flex child to respect parent's height */

    &.inverted {
      flex-direction: column-reverse;
    }
  }

  .story-title-image-container {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 50%;
    overflow: hidden;

    img {
      mask: v-bind(imageMask);
      mask-size: 100%;
      mask-composite: exclude;
    }
  }

  .text-container,
  .image-container {
    box-sizing: border-box;
    width: 100%;
  }

  .image-container {
    flex: 1;
    min-height: 50%;
    overflow: hidden;
  }

  .text-container {
    display: block;
    width: 100%;
    max-height: 50%;
    padding: var(--padding-mobile);
    overflow: auto;

    & p {
      width: 100%;
      text-align: left;
    }
  }

  .story-title-container {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0.5rem;
    width: 60%;
    padding: 40px;
    padding-bottom: 50px;
    background: url('/svgs/story-page/title-box/1.png') no-repeat center;
    background-size: 100% 100%;

    &.top-aligned {
      top: 0;
      bottom: auto;
    }
  }

  .author-name {
    margin-left: 0.3rem;
    font-family: var(--font-link);
  }

  h1 {
    font-size: 1.1rem;
  }

  .top-decoration {
    width: calc(100% + var(--padding-mobile) * 4);
    height: auto;
    max-height: 200px;
    margin-left: calc(var(--padding-mobile) * -1 * 2);
    object-fit: cover;
  }

  .copyright {
    display: block;
    font-size: 0.8rem;
  }

  .bottom-controls {
    display: flex;
    flex-shrink: 0; /* Prevent bottom controls from shrinking */
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    .pagination {
      display: flex;
      gap: 1rem;
      width: fit-content;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        cursor: pointer;
        background: none;
        border: none;

        span {
          display: block;
          width: 10px;
          height: 10px;
          background: url('/svgs/story-page/pagination/page.svg') no-repeat
            center;

          &.active {
            width: 1rem;
            height: 1rem;
            background: url('/svgs/story-page/pagination/current-page.svg')
              no-repeat center;
          }
        }
      }
    }
  }

  #reject-reason {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    resize: none;
    border: 1px solid var(--color-black);
    border-radius: 0.25rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
