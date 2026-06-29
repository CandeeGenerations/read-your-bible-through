export const siteTitle = 'Read Your Bible Through'

export const pages = {
  home: 'home',
  proverbs: 'proverbs',
  psalms: 'psalms',
} as const

export type PageType = (typeof pages)[keyof typeof pages]

export const PASSAGE_TYPES = {
  BIBLE: 'bible',
  PROVERBS: pages.proverbs,
  PSALMS: pages.psalms,
} as const

export type PassageType = (typeof PASSAGE_TYPES)[keyof typeof PASSAGE_TYPES]

// Map a page to its passageType ('home' plan is stored as 'bible').
export const pageToPassageType = (page: PageType): PassageType =>
  page === pages.home ? PASSAGE_TYPES.BIBLE : (page as PassageType)

// Login method / OAuth provider.
export const PROVIDERS = {
  APPLE: 'apple',
  GOOGLE: 'google',
} as const

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS]

export const NT_BOOKS = [
  'MAT',
  'MRK',
  'LUK',
  'JHN',
  'ACT',
  'ROM',
  '1CO',
  '2CO',
  'GAL',
  'EPH',
  'PHP',
  'COL',
  '1TH',
  '2TH',
  '1TI',
  '2TI',
  'TIT',
  'PHM',
  'HEB',
  'JAS',
  '1PE',
  '2PE',
  '1JN',
  '2JN',
  '3JN',
  'JUD',
  'REV',
]
