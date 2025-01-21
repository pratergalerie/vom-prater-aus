import { Temporal } from 'temporal-polyfill'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('Temporal', Temporal)
})
