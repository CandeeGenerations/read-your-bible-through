/* oxlint-disable no-undef, no-console */
/*
 * What the Operator sees, held to a hand-written answer (docs/operator-plan.md in the app's
 * repo). No database: `usage` and `stampOf` are pure.
 *
 *   pnpm verify:operator
 */
import {UsageTrack, UsageUser, isTestLab, usage} from '../src/domains/operator/usage'
import {stampOf} from '../src/domains/track/stamp'

let failures = 0
let checks = 0

const check = (name: string, ok: boolean, detail?: unknown): void => {
  checks++
  if (!ok) {
    failures++
    console.error(`FAIL ${name}`, detail ?? '')
  }
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

// An ObjectId made at an instant: its first four bytes are the seconds.
const oid = (iso: string, n: number): string =>
  Math.floor(Date.parse(iso) / 1000).toString(16) + n.toString(16).padStart(16, '0')

const NOW = new Date('2026-11-04T12:00:00.000Z') // a Wednesday; its week is Monday 2026-11-02

const reader = oid('2023-04-04T12:00:00Z', 1)
const appOnly = oid('2026-10-28T09:00:00Z', 2) // joined in the week of 2026-10-26
const never = oid('2026-11-03T09:00:00Z', 3) // joined this week, marked nothing
const leftOut = oid('2026-10-30T09:00:00Z', 4)

const users: UsageUser[] = [
  {id: reader, name: 'Reader', email: 'reader@example.com', autoTrack: true},
  {id: appOnly, name: 'App Only', email: 'app@example.com', autoTrack: false},
  {id: never, name: 'Never', email: 'never@example.com', autoTrack: true},
  {id: leftOut, name: 'Play Review', email: 'review.12345@example.com', autoTrack: true},
]

const t = (userId: string, fields: Partial<UsageTrack>): UsageTrack => ({
  userId,
  kind: 'passage',
  passageType: 'bible',
  year: 2026,
  isRead: true,
  trackDate: '2026-11-03T13:00:00.000Z',
  updatedAt: '2026-11-03T13:00:00.000Z',
  client: 'ios',
  clientVersion: '1.1.3 (10)',
  ...fields,
})

const tracks: UsageTrack[] = [
  // Reader: two Bible Days on the same UTC day, one on another; a Psalms Day on the web;
  // a Day un-marked (counts nowhere as read); one from last year; a chapter; an unknown one.
  t(reader, {trackDate: '2026-11-03T13:00:00.000Z'}),
  t(reader, {
    trackDate: '2026-11-03T22:00:00.000Z',
    updatedAt: '2026-11-03T22:00:00.000Z',
    clientVersion: '1.1.4 (11)',
  }),
  t(reader, {
    trackDate: '2026-10-20T08:00:00.000Z',
    updatedAt: '2026-10-20T08:00:00.000Z',
    client: 'web',
    clientVersion: '1.13.0',
  }),
  t(reader, {
    passageType: 'psalms',
    trackDate: '2026-10-21T08:00:00.000Z',
    client: 'web',
    clientVersion: '1.13.0',
    updatedAt: '2026-10-21T08:00:00.000Z',
  }),
  t(reader, {
    isRead: false,
    trackDate: '2026-11-01T08:00:00.000Z',
    updatedAt: '2026-11-04T08:00:00.000Z',
    client: 'android',
    clientVersion: '1.1.2 (6)',
  }),
  t(reader, {
    year: 2025,
    trackDate: '2025-12-30T08:00:00.000Z',
    updatedAt: '2025-12-30T08:00:00.000Z',
    client: null,
    clientVersion: null,
  }),
  t(reader, {kind: 'chapter', passageType: undefined, trackDate: '2026-11-03T13:00:00.000Z'}),
  t(reader, {
    passageType: 'proverbs',
    trackDate: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
    client: null,
    clientVersion: null,
  }),
  // App Only: three Days on Android this week, caught up in one sitting - one reading day.
  t(appOnly, {trackDate: '2026-11-02T01:00:00.000Z', client: 'android', clientVersion: '1.1.2 (6)'}),
  t(appOnly, {trackDate: '2026-11-02T01:01:00.000Z', client: 'android', clientVersion: '1.1.2 (6)'}),
  t(appOnly, {trackDate: '2026-11-02T01:02:00.000Z', client: 'android', clientVersion: '1.1.2 (6)'}),
  // Left out: reads a lot, and must be nowhere.
  t(leftOut, {trackDate: '2026-11-03T10:00:00.000Z'}),
  t(leftOut, {kind: 'chapter', passageType: undefined, trackDate: '2026-11-03T10:00:00.000Z'}),
  // A user that does not exist.
  t(oid('2026-01-01T00:00:00Z', 9), {}),
]

const result = usage(users, tracks, new Set([leftOut]), NOW)

// --- The fields, exactly: a new one fails here rather than slipping out --------------

check(
  'totals fields',
  same(Object.keys(result.totals), ['accounts', 'readLast7Days', 'plansThisYear', 'readLast30DaysBy']),
)
check(
  'person fields',
  result.people.every((p) =>
    same(Object.keys(p), [
      'userId',
      'name',
      'email',
      'joinedAt',
      'lastReadAt',
      'daysReadLast30',
      'daysThisYear',
      'chaptersThisYear',
      'autoTrack',
      'clients',
      'weeks',
    ]),
  ),
  result.people.map((p) => Object.keys(p)),
)
check(
  'week fields',
  result.weeks.every((w) =>
    same(Object.keys(w), [
      'week',
      'newAccounts',
      'readers',
      'readersBy',
      'days',
      'chapters',
      'readingDays',
      'chapterDays',
    ]),
  ),
)
check(
  'person week fields',
  result.people.every((p) =>
    p.weeks.every((w) => same(Object.keys(w), ['week', 'readingDays', 'plans', 'chapterDays'])),
  ),
)
check(
  'client fields',
  result.people.every((p) => p.clients.every((c) => same(Object.keys(c), ['client', 'clientVersion', 'lastAt']))),
)
check('top-level fields', same(Object.keys(result), ['totals', 'people', 'weeks']))

// Never which Day or which chapter: no passageDate, book, or day of reading but lastReadAt.
const text = JSON.stringify(result)
check('no passageDate', !text.includes('passageDate') && !text.includes('book'))

// --- Left out ---------------------------------------------------------------------------

check('left out is not a person', !result.people.some((p) => p.userId === leftOut))
check('left out is not counted', result.totals.accounts === 3, result.totals)
check(
  'left out is not in the charts',
  !text.includes(leftOut) && result.weeks.at(-1)!.chapters === 1,
  result.weeks.at(-1),
)
check('left out joined nowhere', result.weeks.find((w) => w.week === '2026-10-26')!.newAccounts === 1)

// --- Totals -----------------------------------------------------------------------------

check('read last 7 days', result.totals.readLast7Days === 2, result.totals)
check(
  'plans this year',
  same(result.totals.plansThisYear, {bible: 2, psalms: 1, proverbs: 1}),
  result.totals.plansThisYear,
)
check(
  'read last 30 days by platform',
  same(result.totals.readLast30DaysBy, {ios: 1, android: 1, web: 1, unknown: 0}),
  result.totals.readLast30DaysBy,
)

// --- People -----------------------------------------------------------------------------

const r = result.people.find((p) => p.userId === reader)!
check('joined from the ObjectId', r.joinedAt === '2023-04-04T12:00:00.000Z', r.joinedAt)
check('last read', r.lastReadAt === '2026-11-03T22:00:00.000Z', r.lastReadAt)
check('days read last 30: distinct UTC days', r.daysReadLast30 === 3, r.daysReadLast30)
check(
  'days this year, un-mark and last year left out',
  same(r.daysThisYear, {bible: 3, psalms: 1, proverbs: 1}),
  r.daysThisYear,
)
check('chapters this year', r.chaptersThisYear === 1)
check(
  'clients: latest version each, latest first, un-marks included, unknown left out',
  same(r.clients, [
    {client: 'android', clientVersion: '1.1.2 (6)', lastAt: '2026-11-04T08:00:00.000Z'},
    {client: 'ios', clientVersion: '1.1.4 (11)', lastAt: '2026-11-03T22:00:00.000Z'},
    {client: 'web', clientVersion: '1.13.0', lastAt: '2026-10-21T08:00:00.000Z'},
  ]),
  r.clients,
)

check(
  "a person's weeks: reading days, only weeks with some, oldest first",
  same(r.weeks, [
    {week: '2025-12-29', readingDays: 1, plans: {bible: 1, psalms: 0, proverbs: 0}, chapterDays: 0},
    {week: '2026-08-31', readingDays: 1, plans: {bible: 0, psalms: 0, proverbs: 1}, chapterDays: 0},
    {week: '2026-10-19', readingDays: 2, plans: {bible: 1, psalms: 1, proverbs: 0}, chapterDays: 0},
    {week: '2026-11-02', readingDays: 1, plans: {bible: 1, psalms: 0, proverbs: 0}, chapterDays: 1},
  ]),
  r.weeks,
)
const a = result.people.find((p) => p.userId === appOnly)!
check(
  'caught up in one sitting is one reading day',
  same(
    a.weeks.map((w) => w.readingDays),
    [1],
  ),
  a.weeks,
)

const n = result.people.find((p) => p.userId === never)!
check('never read', n.lastReadAt === null && n.daysReadLast30 === 0 && same(n.clients, []) && same(n.weeks, []), n)
check('auto-track', result.people.find((p) => p.userId === appOnly)!.autoTrack === false)

// --- Weeks ------------------------------------------------------------------------------

check('52 weeks, oldest first', result.weeks.length === 52 && result.weeks.at(-1)!.week === '2026-11-02')
const thisWeek = result.weeks.at(-1)!
check('this week joined', thisWeek.newAccounts === 1, thisWeek)
check(
  'this week readers',
  thisWeek.readers === 2 && same(thisWeek.readersBy, {ios: 1, android: 1, web: 0, unknown: 0}),
  thisWeek,
)
check('this week days', same(thisWeek.days, {bible: 5, psalms: 0, proverbs: 0}), thisWeek.days)
check(
  'this week reading days',
  same(thisWeek.readingDays, {bible: 2, psalms: 0, proverbs: 0}) && thisWeek.chapterDays === 1,
  thisWeek,
)
const oct19 = result.weeks.find((w) => w.week === '2026-10-19')!
check('a web week', same(oct19.readersBy, {ios: 0, android: 0, web: 1, unknown: 0}) && oct19.days.psalms === 1, oct19)

// --- Google's test lab -----------------------------------------------------------------

check('test lab by account email', isTestLab(['SZB3DY2SSI5SRNUHZKYWT4-LVL-00@cloudtestlabaccounts.com']))
check('test lab by a sign-in method', isTestLab(['someone@privaterelay.appleid.com', 'x@CloudTestLabAccounts.com']))
check(
  'not a look-alike',
  !isTestLab(['reader@cloudtestlabaccounts.com.example.org', 'cloudtestlabaccounts.com@gmail.com', null]),
)

// --- The stamp --------------------------------------------------------------------------

check(
  'stamp kept',
  same(stampOf({client: 'ios', clientVersion: '1.1.3 (10)'}), {client: 'ios', clientVersion: '1.1.3 (10)'}),
)
check('no stamp clears it', same(stampOf({}), {client: null, clientVersion: null}))
check(
  'unknown app clears it',
  same(stampOf({client: 'watch', clientVersion: '1'}), {client: null, clientVersion: null}),
)
check('version alone clears it', same(stampOf({clientVersion: '1.1.3'}), {client: null, clientVersion: null}))
check('version capped', stampOf({client: 'web', clientVersion: 'x'.repeat(100)}).clientVersion!.length === 40)

console.log(
  failures === 0 ? `verify-operator: ${checks} checks passed` : `verify-operator: ${failures} of ${checks} failed`,
)
process.exitCode = failures === 0 ? 0 : 1
