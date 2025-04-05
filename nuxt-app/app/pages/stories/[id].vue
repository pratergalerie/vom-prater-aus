<script lang="ts" setup>
  import data from '~/data/stories.json'

  type Paragraph = {
    type: 'paragraph'
    content: string
  }

  type Image = {
    type: 'image'
    src: string
    alt: string
  }

  type Story = {
    id: number
    title: string
    image: string
    author: string
    date: string
    excerpt: string
    pages: {
      contents: (Paragraph | Image)[]
    }[]
  }

  definePageMeta({
    layout: 'no-footer',
  })

  const route = useRoute()

  const story = ref<Story | null>(null)

  // @ts-expect-error - Story is not null
  story.value = data.stories.find(
    // @ts-expect-error - id is a number
    (story: Story) => story.id.toString() === route.params.id
  )

  const currentPage = ref(0)

  const clipPath =
    'polygon(0 0, 100% 0, 100% 85%, 80% 88%, 70% 92%, 60% 90%, 50% 95%, 40% 90%, 30% 92%, 20% 88%, 0 95%)'
</script>

<template>
  <div
    v-if="story"
    class="story-container"
  >
    <div
      v-if="currentPage === 0"
      class="story-title-image-container"
      :style="{ clipPath }"
    >
      <img
        :src="story.image"
        alt="Story image"
      />
      <div class="story-title-container">
        <h1>{{ story.title }}</h1>
        <p>{{ story.date }}</p>
        <p>
          Eine Geschichte von
          <span class="author-name">{{ story.author }}</span>
        </p>
      </div>
    </div>

    <NuxtImg
      v-if="currentPage > 0"
      src="/imgs/stories/top-decoration.png"
      class="top-decoration"
    />

    <!-- Render current page with a pagination control -->
    <div>
      <section
        v-for="(content, index) in story.pages[currentPage]?.contents"
        :key="index"
        class="story-page"
      >
        <p v-if="content.type === 'paragraph'">{{ content.content }}</p>
        <div v-else-if="content.type === 'image'">
          <NuxtImg
            :src="content.src"
            :alt="content.alt"
          />
          <span class="copyright">© {{ story.author }}</span>
        </div>
      </section>
    </div>

    <div class="bottom-controls">
      <BaseButton
        type="secondary"
        variant="icon"
        icon="close"
        class="close-button"
        @click="$router.back()"
      />
      <div class="pagination">
        <button
          v-for="(_, index) in story.pages"
          :key="index"
          @click="currentPage = index"
        >
          <span :class="{ active: currentPage === index }" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .story-container {
    position: relative;
    max-width: 800px;
    height: calc(
      100vh - var(--header-height) - var(--padding-mobile) * 2 - 75px
    );
    padding: var(--header-height) 0 0 0;
  }

  h1 {
    margin: 0;
    font-size: 1.1rem;
  }

  .story-title-image-container {
    position: relative;
    height: 40vh;
    margin: 0 calc(var(--padding-mobile) * -1);
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
    }

    .story-title-container {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      width: 60%;
      padding: var(--padding-mobile);
      padding-bottom: 50px;
      background: url('/imgs/stories/title-box.png') no-repeat center;
    }

    .author-name {
      margin-left: 0.3rem;
      font-family: var(--font-link);
    }
  }

  .top-decoration {
    width: calc(100% + var(--padding-mobile) * 4);
    height: auto;
    max-height: 200px;
    margin-left: calc(var(--padding-mobile) * -1 * 2);
    object-fit: cover;
  }

  .story-page {
    padding: 0 var(--padding-mobile);
    margin: 1rem 0;

    p {
      margin: 0;
    }

    img {
      width: calc(100% + var(--padding-mobile) * 4);
      height: auto;
      max-height: 180px;
      margin-left: calc(var(--padding-mobile) * -1 * 2);
      object-fit: cover;
    }

    .copyright {
      display: block;
      font-size: 0.8rem;
    }
  }

  .bottom-controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 99;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    transform: translateX(-50%);

    .close-button {
      width: 40px;
    }

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
        background: none;
        border: none;

        span {
          display: block;
          width: 10px;
          height: 10px;
          background: url('/svgs/pagination/page.svg') no-repeat center;

          &.active {
            width: 1rem;
            height: 1rem;
            background: url('/svgs/pagination/current-page.svg') no-repeat
              center;
          }
        }
      }
    }
  }
</style>
