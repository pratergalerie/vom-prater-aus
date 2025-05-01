import localforage from 'localforage'

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize localForage
  localforage.config({
    name: 'vom-prater-aus',
    storeName: 'story_store',
  })
  nuxtApp.provide('localForage', localforage)
})
