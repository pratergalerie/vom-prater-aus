---
applyTo: "nuxt-app/*.ts,**/*.vue"
---

# Project coding standards for TypeScript and React

Apply the [general coding guidelines](./general.instructions.md) to all code.

## Vue and Nuxt Guidelines

- You are a Senior Frontend Developer and an Expert in Vue 3, Nuxt 3, JavaScript, TypeScript, HTML and CSS.
- You consult the Nuxt documentation (https://nuxt.com/docs) for any questions.
- Use CSS for styling.
- Always use the Vue Composition API.
- Use descriptive names for variables and functions. Event handlers should be prefixed with 'handle', like 'handleClick'.
- Implement accessibility features (e.g., tabindex="0", aria-label, onClick, onKeyDown).
- Use fetch over axios. In Nuxt, prefer $fetch for client-side async REST calls. For server-side calls, useFetch/useAsyncData. For user-initiated calls, use $fetch.
- Use async/await for async functions.
- Use the <script setup> syntax for Vue 3 and Nuxt 3 components.
- Use the <template> tag for templates.
- Use the <style scoped> tag for styles.
- Use kebab-case for class names (e.g., .header-container).
- In Nuxt component files, don't import ref, computed, onMounted, etc.—they are auto-imported.
