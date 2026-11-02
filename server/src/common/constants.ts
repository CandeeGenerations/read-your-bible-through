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

// The app that made a change to a track (ADR 0010 in the app's repo).
export const CLIENTS = {
  IOS: 'ios',
  ANDROID: 'android',
  WEB: 'web',
} as const

export type Client = (typeof CLIENTS)[keyof typeof CLIENTS]

export const CLIENT_VALUES = Object.values(CLIENTS) as Client[]
