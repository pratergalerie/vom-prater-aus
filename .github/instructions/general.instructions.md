---
applyTo: "**"
---

# Project general coding standards

- Give nuanced, accurate, factual, and thoughtful answers.
- Always follow the user's requirements to the letter.
- Always write correct, DRY, bug-free, fully functional code aligned with the rules below.
- Code must be complete — no TODOs or missing pieces.
- Verify all code thoroughly. Include all required imports. Name components properly.
- Focus on readable and easy-to-understand code, over performance.
- Be concise. Avoid unnecessary prose. If uncertain, say so instead of guessing.
- Use early returns when possible.

## TypeScript Guidelines

- Use TypeScript for all JavaScript files
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Use functions instead of consts for logic (e.g., 'function toggle()') and define types when possible.

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Use JSDoc comments for public methods and properties

## Error Handling

- Use try/catch blocks for async operations
- Implement proper error boundaries in Vue or Nuxt components
- Always log errors with contextual information

## HTML guidelines

- Use semantic HTML elements
- Use aria attributes for accessibility
- Use descriptive class names
- Use meaningful IDs for elements
- Use inputs inside labels for better accessibility, and use the 'for' attribute to link the label to the input
- Visible, non-interactive elements should not have an interactive handler. Example: `<div role="button" tabindex="0" aria-label="Close lightbox" @click="handleClose" @keydown.enter="handleClose" @keydown.space.prevent="handleClose" @keydown.esc="handleClose">`. This is to be avoided. Always use buttons instead.
