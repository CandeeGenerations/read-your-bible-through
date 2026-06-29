export const LOG_LEVELS = {
  ERROR: 'error',
  INFO: 'info',
  DEBUG: 'debug',
}

export const PASSAGE_TYPES = {
  BIBLE: 'bible',
  PROVERBS: 'proverbs',
  PSALMS: 'psalms',
} as const

export type PassageType = (typeof PASSAGE_TYPES)[keyof typeof PASSAGE_TYPES]

export const PASSAGE_TYPE_VALUES = Object.values(PASSAGE_TYPES) as PassageType[]

// Login method / OAuth provider.
export const PROVIDERS = {
  APPLE: 'apple',
  GOOGLE: 'google',
} as const

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS]

export const PROVIDER_VALUES = Object.values(PROVIDERS) as Provider[]
