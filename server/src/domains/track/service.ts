import {ChapterTrack, PassageTrack} from '@prisma/client'
import client from '@src/common/client'
import {PASSAGE_TYPE_VALUES, PassageType} from '@src/common/constants'
import dayjs from 'dayjs'

import {stampOf} from './stamp'

// Reject client action-times more than this far in the future (clock-skew guard).
const FUTURE_SKEW_MS = 5 * 60 * 1000

export interface PassageInput {
  passageDate: string
  passageType: string
  isRead: boolean
  updatedAt: string // client action-time (ISO)
  client?: string
  clientVersion?: string
}

export interface ChapterInput {
  // Missing from app versions released before Read Chapters were kept by the year
  // (iOS 1.1.1, Android 1.1.0): those get the year of their updatedAt.
  year?: number
  book: string
  chapter: string
  isRead: boolean
  updatedAt: string // client action-time (ISO)
  client?: string
  clientVersion?: string
}

const isSaneTime = (updatedAt: string): boolean => {
  const t = dayjs(updatedAt)

  return t.isValid() && t.valueOf() <= Date.now() + FUTURE_SKEW_MS
}

// The year a chapter is read in: the app's own, or for an app that sends none, the year
// of its updatedAt - UTC, so a mark made late on December 31st west of Greenwich lands in
// the new year. Accepted for the versions on their way out.
const yearOf = (input: ChapterInput): number | null => {
  const year = input.year ?? dayjs(input.updatedAt).toDate().getUTCFullYear()

  return Number.isInteger(year) && year >= 2000 && year <= dayjs().year() + 1 ? year : null
}

// --- Pull (incremental) ---------------------------------------------------

// Passages: scoped to the current calendar year (plan resets yearly).
const getPassages = async (userId: string, since?: string): Promise<PassageTrack[]> =>
  await client.passageTrack.findMany({
    where: {
      userId,
      passageDate: {
        gte: dayjs().startOf('year').format('YYYY-MM-DD'),
        lte: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
      ...(since ? {updatedAt: {gt: since}} : {}),
    },
  })

// Chapters: a calendar year's at a time (at most 1,189 rows a user a year). Every year for
// an app that asks for them all; the current year's for one that does not - an app
// released before chapters had a year, which keeps them by book and chapter alone.
const getChapters = async (userId: string, allYears: boolean, since?: string): Promise<ChapterTrack[]> =>
  await client.chapterTrack.findMany({
    where: {
      userId,
      ...(allYears ? {} : {year: dayjs().year()}),
      ...(since ? {updatedAt: {gt: since}} : {}),
    },
  })

const getAll = async (
  userId: string,
  allYears: boolean,
  since?: string,
): Promise<{passages: PassageTrack[]; chapters: ChapterTrack[]}> => ({
  passages: await getPassages(userId, since),
  chapters: await getChapters(userId, allYears, since),
})

// --- Upsert (LWW by updatedAt) -------------------------------------------

const upsertPassage = async (userId: string, input: PassageInput): Promise<PassageTrack | null> => {
  if (!isSaneTime(input.updatedAt)) return null
  if (!PASSAGE_TYPE_VALUES.includes(input.passageType as PassageType)) return null

  const serverAt = dayjs().format()
  const existing = await client.passageTrack.findFirst({
    where: {userId, passageDate: input.passageDate, passageType: input.passageType},
  })

  // Last-write-wins: ignore stale writes.
  if (existing && existing.updatedAt >= input.updatedAt) return existing

  const data = {
    isRead: input.isRead,
    trackDate: input.isRead ? input.updatedAt : existing?.trackDate || input.updatedAt,
    updatedAt: input.updatedAt,
    serverAt,
    ...stampOf(input),
  }

  if (existing) {
    return await client.passageTrack.update({where: {id: existing.id}, data})
  }

  return await client.passageTrack.create({
    data: {userId, passageDate: input.passageDate, passageType: input.passageType, ...data},
  })
}

const upsertChapter = async (userId: string, input: ChapterInput): Promise<ChapterTrack | null> => {
  if (!isSaneTime(input.updatedAt)) return null
  const year = yearOf(input)
  if (year === null) return null

  const serverAt = dayjs().format()
  const existing = await client.chapterTrack.findFirst({
    where: {userId, year, book: input.book, chapter: input.chapter},
  })

  if (existing && existing.updatedAt >= input.updatedAt) return existing

  const data = {
    isRead: input.isRead,
    trackDate: input.isRead ? input.updatedAt : existing?.trackDate || input.updatedAt,
    updatedAt: input.updatedAt,
    serverAt,
    ...stampOf(input),
  }

  if (existing) {
    return await client.chapterTrack.update({where: {id: existing.id}, data})
  }

  return await client.chapterTrack.create({
    data: {userId, year, book: input.book, chapter: input.chapter, ...data},
  })
}

const upsertBatch = async (
  userId: string,
  passages: PassageInput[],
  chapters: ChapterInput[],
): Promise<{passages: PassageTrack[]; chapters: ChapterTrack[]}> => {
  const p = await Promise.all(passages.map((x) => upsertPassage(userId, x)))
  const c = await Promise.all(chapters.map((x) => upsertChapter(userId, x)))

  return {passages: p.filter(Boolean) as PassageTrack[], chapters: c.filter(Boolean) as ChapterTrack[]}
}

export default {getAll, upsertBatch}
