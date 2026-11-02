/* oxlint-disable no-undef, no-console */
/*
 * Read Chapters by the year — run ONCE, with a DB backup, BEFORE deploying the server that
 * reads `ChapterTrack.year` (a row without it fails to load).
 *
 *   pnpm migrate:chapter-years
 *
 * Gives every ChapterTrack without a year the year of its updatedAt, UTC - the same year the
 * apps' own migration gives their copy, so the two agree. Idempotent: rows with a year are
 * left alone.
 *
 * After this completes, swap the unique index (userId, book, chapter) for
 * (userId, year, book, chapter) with:  pnpm db:push
 */
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const COLLECTION = 'ChapterTrack'

const backfill = async (): Promise<void> => {
  const res = (await prisma.$runCommandRaw({
    update: COLLECTION,
    updates: [
      {
        q: {year: {$exists: false}},
        // updatedAt is a SyncTime, "2026-09-11T21:05:03.123Z": its first four characters
        // are the UTC year.
        u: [{$set: {year: {$toInt: {$substrBytes: ['$updatedAt', 0, 4]}}}}],
        multi: true,
      },
    ],
  })) as {n?: number; nModified?: number}

  console.log(`  backfill: matched=${res.n ?? '?'} modified=${res.nModified ?? '?'}`)
}

const main = async (): Promise<void> => {
  console.log('Chapter years migration starting...')
  await backfill()
  console.log('Done. Now run:  pnpm db:push   (swaps in the yearly unique index)')
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
