export const LOG_LEVELS = {
  ERROR: 'error',
  INFO: 'info',
  DEBUG: 'debug',
}

export const PASSAGE_TYPES = {
  PROVERBS: 'proverbs',
  PSALMS: 'psalms',
  NULL: null,
} as const

export type PassageType = (typeof PASSAGE_TYPES)[keyof typeof PASSAGE_TYPES] | null
