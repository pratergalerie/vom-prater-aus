<script setup>
  const illustrationImage = '/imgs/prater/prater2.jpeg'
  const navTopShape = '/svgs/menu/shapes/background/viridian/1.svg'
  const figureTopShape = '/svgs/menu/shapes/background/mustard/1.svg'

  const maskedImgRef = ref(null)

  onMounted(() => {
    createMask()
  })

  function createMask() {
    // Generate an image element with the figureTopShape SVG as the top shape
    // and a solid color rectangle as the bottom shape. The rectangle should be
    // 30vh and the figureTopShape should be positioned at the top.

    const mask = document.createElement('canvas')
    mask.width = 1000
    mask.height = 1000
    const ctx = mask.getContext('2d')

    const img = new Image()
    img.src = figureTopShape

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1000, 1000)
      ctx.fillStyle = 'var(--mustard)'
      ctx.fillRect(0, 0, 1000, 1000)
    }

    const maskUrl = mask.toDataURL()
    maskRef.value.style.mask = `url(${maskUrl}) no-repeat`
  }
</script>

<template>
  <div class="menu">
    <div class="illustration">
      <figure
        ref="maskedImgRef"
        class="masked-image"
      >
        <NuxtImg :src="illustrationImage" />
      </figure>
      <NuxtImg
        :src="navTopShape"
        class="nav-top-shape"
      />
    </div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Main page</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/prater">About Berliner Prater</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/stories">Discover the stories</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/create">Write your story</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About the project</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
  .menu {
    position: fixed;
    top: var(--header-height);
    z-index: 2;
    display: grid;
    grid-template-areas: 'illustration' 'nav';
    grid-template-rows: 1fr 2fr;
    width: 100%;
    height: calc(100vh - var(--header-height));
  }

  .illustration {
    position: relative;
    grid-area: illustration;
    width: 100%;
    padding: 0%;
    margin: 0;
  }

  .masked-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: var(--mustard);
    mask: url('#mask') no-repeat;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }
  }

  .nav-top-shape {
    position: absolute;

    /* Avoid gap between nav and top illustration */
    bottom: -1px;
  }

  nav {
    display: flex;
    flex-direction: column;
    grid-area: nav;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    color: var(--light-beige);
    background: var(--viridian);

    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      margin: 0;
      list-style: none;

      li {
        font-family: var(--link-font);
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.5rem;
        color: var(--light-beige);
        text-align: right;
        cursor: pointer;
      }
    }
  }
</style>
