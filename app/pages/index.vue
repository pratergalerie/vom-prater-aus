<script setup lang="ts"></script>

<template>
  <div class="content-wrapper">
    <BaseButton
      label="Test label"
      type="secondary"
      variant="label"
    />
    <BaseButton
      icon="account"
      type="secondary"
      variant="icon"
    />
    <h1>Example heading 1</h1>
    <h2>Example heading 2</h2>
    <h3>Example heading 3</h3>
    <h4>Example heading 4</h4>
    <p>Example paragraph, lorem ipsum et sit amet.</p>
    <a href="">Example link</a>
  </div>
</template>

<style scoped>
  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
