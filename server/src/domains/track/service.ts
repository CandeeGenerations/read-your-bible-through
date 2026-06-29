import {ChapterTrack, PassageTrack} from '@prisma/client'
import client from '@src/common/client'
import {PASSAGE_TYPE_VALUES, PassageType} from '@src/common/constants'
import dayjs from 'dayjs'

// Reject client action-times more than this far in the future (clock-skew guard).
const FUTURE_SKEW_MS = 5 * 60 * 1000

export interface PassageInput {
  passageDate: string
  passageType: string
  isRead: boolean
  updatedAt: string // client action-time (ISO)
}

export interface ChapterInput {
  book: string
  chapter: string
  isRead: boolean
  updatedAt: string // client action-time (ISO)
}

const isSaneTime = (updatedAt: string): boolean => {
  const t = dayjs(updatedAt)

  return t.isValid() && t.valueOf() <= Date.now() + FUTURE_SKEW_MS
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

// Chapters: lifetime-cumulative (naturally bounded at ~1,189 rows/user).
const getChapters = async (userId: string, since?: string): Promise<ChapterTrack[]> =>
  await client.chapterTrack.findMany({
    where: {userId, ...(since ? {updatedAt: {gt: since}} : {})},
  })

const getAll = async (
  userId: string,
  since?: string,
): Promise<{passages: PassageTrack[]; chapters: ChapterTrack[]}> => ({
  passages: await getPassages(userId, since),
  chapters: await getChapters(userId, since),
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

  const serverAt = dayjs().format()
  const existing = await client.chapterTrack.findFirst({
    where: {userId, book: input.book, chapter: input.chapter},
  })

  if (existing && existing.updatedAt >= input.updatedAt) return existing

  const data = {
    isRead: input.isRead,
    trackDate: input.isRead ? input.updatedAt : existing?.trackDate || input.updatedAt,
    updatedAt: input.updatedAt,
    serverAt,
  }

  if (existing) {
    return await client.chapterTrack.update({where: {id: existing.id}, data})
  }

  return await client.chapterTrack.create({
    data: {userId, book: input.book, chapter: input.chapter, ...data},
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
