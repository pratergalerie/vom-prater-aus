type ValidationRule = {
  required: boolean
  pattern: RegExp
  allowedChars: string
  maxLength?: number
  message: string
}

export const validationRules = {
  authorName: {
    required: true,
    pattern: /^[a-zA-Z0-9-_]+$/,
    allowedChars:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
    maxLength: 30,
    message:
      'Author name must contain only letters, numbers, dashes, and underscores, and be max 30 characters',
  } as ValidationRule,
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    allowedChars:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~@.",
    message: 'Please enter a valid email address',
  } as ValidationRule,
  title: {
    required: true,
    pattern: /^[a-zA-Z0-9\s:-]+$/,
    allowedChars:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 :-',
    maxLength: 80,
    message:
      'Title must contain only letters, numbers, spaces, dashes, and colons, and be max 80 characters',
  } as ValidationRule,
} as const

export function validateField(
  value: string,
  rules: (typeof validationRules)[keyof typeof validationRules]
): string | null {
  if (rules.required && !value) {
    return 'This field is required'
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message
  }

  return null
}

export function sanitizeInput(value: string, allowedChars: string): string {
  return value
    .split('')
    .filter((char) => allowedChars.includes(char))
    .join('')
}
