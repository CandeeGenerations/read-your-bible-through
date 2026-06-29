/* eslint-disable no-undef, no-console */
/*
 * Phase 0 migration — run ONCE, with a DB backup.
 *
 *   pnpm migrate:phase0
 *
 * Steps (idempotent):
 *  1. Backfill PassageTrack: isRead=true, updatedAt/serverAt=trackDate,
 *     passageType null/missing -> 'bible'.
 *  2. De-dup (userId, passageDate, passageType), keeping the latest trackDate.
 *
 * After this completes, add the new unique indexes with:  pnpm db:push
 * (db push will fail if step 2 left duplicates — that's the safety net.)
 */
import {PrismaClient} from '@prisma/client'
import {PASSAGE_TYPES} from '@src/common/constants'

const prisma = new PrismaClient()

const COLLECTION = 'PassageTrack'

const backfill = async (): Promise<void> => {
  const res = (await prisma.$runCommandRaw({
    update: COLLECTION,
    updates: [
      {
        q: {},
        // Aggregation-pipeline update: derive new fields from existing ones.
        u: [
          {
            $set: {
              passageType: {$ifNull: ['$passageType', PASSAGE_TYPES.BIBLE]},
              isRead: {$ifNull: ['$isRead', true]},
              updatedAt: {$ifNull: ['$updatedAt', '$trackDate']},
              serverAt: {$ifNull: ['$serverAt', '$trackDate']},
            },
          },
        ],
        multi: true,
      },
    ],
  })) as {n?: number; nModified?: number}

  console.log(`  backfill: matched=${res.n ?? '?'} modified=${res.nModified ?? '?'}`)
}

const dedupe = async (): Promise<void> => {
  const agg = (await prisma.$runCommandRaw({
    aggregate: COLLECTION,
    pipeline: [
      {$sort: {trackDate: -1}},
      {$group: {_id: {u: '$userId', d: '$passageDate', t: '$passageType'}, ids: {$push: '$_id'}}},
      {$match: {$expr: {$gt: [{$size: '$ids'}, 1]}}},
      // keep ids[0] (latest trackDate), drop the rest
      {$project: {drop: {$slice: ['$ids', 1, {$size: '$ids'}]}}},
      {$unwind: '$drop'},
    ],
    cursor: {},
  })) as {cursor?: {firstBatch?: {drop: unknown}[]}}

  const dropIds = (agg.cursor?.firstBatch || []).map((x) => x.drop)

  if (dropIds.length === 0) {
    console.log('  dedupe: no duplicates')
    return
  }

  const res = (await prisma.$runCommandRaw({
    delete: COLLECTION,
    deletes: [{q: {_id: {$in: dropIds as never[]}}, limit: 0}],
  })) as {n?: number}

  console.log(`  dedupe: removed ${res.n ?? dropIds.length} duplicate row(s)`)
}

const main = async (): Promise<void> => {
  console.log('Phase 0 migration starting...')
  await backfill()
  await dedupe()
  console.log('Done. Now run:  pnpm db:push   (creates the new unique indexes)')
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
