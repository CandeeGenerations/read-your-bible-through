/* oxlint-disable no-undef, no-console */
/*
 * The app behind each track, for those from before it was recorded (ADR 0010 in the app's
 * repo) - run ONCE, after deploying the server that writes `client`.
 *
 *   pnpm backfill:client
 *
 * The app went live on 2026-09-16. A track the server last received before then can only
 * have come from the website, so it is stamped 'web'. Everything after stays unknown: nothing
 * on it says which, and a guess would be shown as a fact. Idempotent: a track with a client
 * is left alone.
 */
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// Extended JSON, as $runCommandRaw takes it. One that cannot be read counts as not before.
const APP_LIVE = {$date: '2026-09-16T00:00:00Z'}

const backfill = async (collection: string): Promise<void> => {
  const res = (await prisma.$runCommandRaw({
    update: collection,
    updates: [
      {
        q: {
          client: {$exists: false},
          // serverAt is dayjs().format() - an offset, not always Z - so compared as a date.
          $expr: {
            $lt: [{$dateFromString: {dateString: '$serverAt', onError: APP_LIVE, onNull: APP_LIVE}}, APP_LIVE],
          },
        },
        u: {$set: {client: 'web', clientVersion: null}},
        multi: true,
      },
    ],
  })) as {n?: number; nModified?: number}

  console.log(`${collection}: ${res.nModified ?? 0} stamped web`)
}

const main = async (): Promise<void> => {
  await backfill('PassageTrack')
  await backfill('ChapterTrack')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
