export const siteTitle = 'Read Your Bible Through'

export const pages = {
  home: 'home',
  proverbs: 'proverbs',
  psalms: 'psalms',
} as const

export type PageType = (typeof pages)[keyof typeof pages]

export const PASSAGE_TYPES = {
  PROVERBS: 'proverbs',
  PSALMS: 'psalms',
  NULL: null,
} as const

export type PassageType = (typeof PASSAGE_TYPES)[keyof typeof PASSAGE_TYPES] | null

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
