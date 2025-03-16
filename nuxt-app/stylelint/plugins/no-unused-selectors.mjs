import stylelint from 'stylelint'
import { Parser } from 'htmlparser2'
import fs from 'fs'
import path from 'path'
import selectorParser from 'postcss-selector-parser'

const ruleName = 'plugins/no-unused-selectors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (selector) => `Unused CSS selector "${selector}" found.`,
})

// List of tags to ignore during the comparison
const defaultIgnoredTags = ['html', 'head', 'title', 'style']

// Map custom components to their equivalent standard HTML elements
const customComponentMap = {
  NuxtImg: 'img',
  NuxtLink: 'a',
  // Add more mappings as needed
}

// Function to extract tag names, class, id, and dynamic classes from the HTML content using htmlparser2
const extractUsedSelectorsFromHTML = (htmlContent, usedSelectors) => {
  const parser = new Parser(
    {
      onopentag(name, attribs) {
        // Convert tag name to lowercase and check if it's a custom component
        const lowercaseName = name.toLowerCase()
        const originalName = Object.keys(customComponentMap).find(
          (key) => key.toLowerCase() === lowercaseName
        )
        const mappedName = originalName
          ? customComponentMap[originalName]
          : name

        // Ignore tags that shouldn't be styled
        if (!defaultIgnoredTags.includes(mappedName)) {
          // Add the mapped tag name (e.g., "a" for "NuxtLink")
          usedSelectors.add(mappedName)

          // Extract class attributes
          if (attribs.class) {
            const classList = attribs.class.split(' ').map((cls) => cls.trim())
            classList.forEach((cls) => usedSelectors.add(cls))
          }

          // Extract id attributes
          if (attribs.id) {
            usedSelectors.add(attribs.id)
          }
        }
      },
    },
    { decodeEntities: true }
  )

  // Parse the HTML content
  parser.write(htmlContent)
  parser.end()

  // Additional step: Extract dynamic classes from Vue bindings
  extractDynamicVueClasses(htmlContent, usedSelectors)
}

// Function to detect dynamic classes within Vue templates
const extractDynamicVueClasses = (htmlContent, usedSelectors) => {
  // Match patterns like: :class="{ long: tick.long }" or :class="['a', 'b', someClass]"
  const dynamicClassObjectRegex = /:class\s*=\s*["']\{([^}]+)\}["']/g
  const dynamicClassArrayRegex = /:class\s*=\s*["']\[(.*?)\]["']/g
  const dynamicClassStringRegex = /:class\s*=\s*["']([^"']+)["']/g

  let match

  // Handle object binding (e.g., :class="{ active: isActive }")
  while ((match = dynamicClassObjectRegex.exec(htmlContent)) !== null) {
    const dynamicClasses = match[1]
      .split(/[:,]/)
      .map((cls) => cls.trim().replace(/['"]/g, ''))
    dynamicClasses.forEach((cls) => {
      if (cls) {
        usedSelectors.add(cls)
      }
    })
  }

  // Handle array binding (e.g., :class="['a', 'b', someClass]")
  while ((match = dynamicClassArrayRegex.exec(htmlContent)) !== null) {
    const dynamicClasses = match[1]
      .split(/[\s,]+/)
      .map((cls) => cls.trim().replace(/['"]/g, ''))
    dynamicClasses.forEach((cls) => {
      if (cls) {
        usedSelectors.add(cls)
      }
    })
  }

  // Handle direct class binding (e.g., :class="'someClass'")
  while ((match = dynamicClassStringRegex.exec(htmlContent)) !== null) {
    const dynamicClasses = match[1].split(/\s+/).map((cls) => cls.trim())
    dynamicClasses.forEach((cls) => {
      if (cls) {
        usedSelectors.add(cls)
      }
    })
  }
}

// Function to determine if a selector matches any of the ignore patterns using regex
const shouldIgnoreSelector = (selector, ignoredPatterns) => {
  return ignoredPatterns.some((pattern) => new RegExp(pattern).test(selector))
}

// Function to expand and add selectors using postcss-selector-parser, and skip pseudo-elements/classes
const addCssSelectors = (
  selector,
  cssSelectors,
  ignoredPatterns,
  ignoredSelectors
) => {
  selectorParser((selectors) => {
    selectors.walk((node) => {
      // Only process class, id, and tag nodes
      if (node.type !== 'class' && node.type !== 'id' && node.type !== 'tag')
        return

      // Skip pseudo-elements, pseudo-classes, and explicitly ignored selectors
      if (
        node.toString().includes('::') ||
        node.toString().includes(':') ||
        ignoredSelectors.has(node.toString())
      ) {
        return
      }

      const fullSelector = node.toString().trim()
      if (!shouldIgnoreSelector(fullSelector, ignoredPatterns)) {
        cssSelectors.add(fullSelector)
      }
    })
  }).processSync(selector)
}

const ruleFunction = (primaryOption, options) => {
  // Collect ignored patterns and custom ignored selectors from options
  const ignoredPatterns = options?.ignore || []
  const customIgnoredSelectors = options?.ignoredSelectors || []
  const defaultIgnoredSelectors = ['from', 'to'] // Default ignored selectors for keyframes

  // Combine default and custom ignored selectors
  const ignoredSelectors = new Set([
    ...defaultIgnoredSelectors,
    ...customIgnoredSelectors,
  ])

  return (root, result) => {
    const usedSelectors = new Set() // Set to store selectors used in the template or HTML
    const cssSelectors = new Set() // Set to store selectors defined in CSS rules

    // Manually read the HTML file content
    const filePath = root.source.input.file
    const fileContent = fs.readFileSync(path.resolve(filePath), 'utf8')

    // Parse the HTML and extract selectors
    extractUsedSelectorsFromHTML(fileContent, usedSelectors)

    // Walk through CSS rules and expand nested selectors using postcss-selector-parser
    root.walkRules((ruleNode) => {
      ruleNode.selectors.forEach((selector) => {
        addCssSelectors(
          selector,
          cssSelectors,
          ignoredPatterns,
          ignoredSelectors
        )
      })
    })

    // Compare CSS selectors and used selectors to report unused ones
    root.walkRules((ruleNode) => {
      ruleNode.selectors.forEach((cssSelector) => {
        const simpleSelector = cssSelector.trim()

        // Skip ignored selectors and pseudo-elements/classes
        if (
          ignoredSelectors.has(simpleSelector) || // Skip ignored selectors
          shouldIgnoreSelector(simpleSelector, ignoredPatterns) ||
          simpleSelector.includes(':')
        )
          return

        // Check if the selector is used or not
        const isUsed = Array.from(usedSelectors).some((used) =>
          simpleSelector.includes(used)
        )

        if (!isUsed) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.rejected(simpleSelector),
            node: ruleNode,
            word: cssSelector,
            index: ruleNode.source.start.column,
            endIndex: ruleNode.source.end.column,
          })
        }
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default stylelint.createPlugin(ruleName, ruleFunction)
