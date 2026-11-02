// What the Operator sees, worked out from the tracks themselves (ADR 0010 in the app's repo,
// and its docs/operator-plan.md). Pure, so scripts/verify-operator.ts can hold it to a
// hand-written answer.
//
// Look only, and counts only: nothing here says which days or which chapters anybody read.
// verify-operator.ts holds the fields to exactly these - a new one fails the check rather
// than slipping out.
//
// A day of reading is a UTC day of `trackDate`, the instant a mark was made - not the
// reader's own Day, which the server does not know.
import {CLIENT_VALUES, Client, PASSAGE_TYPE_VALUES, PassageType} from '@src/common/constants'

const DAY_MS = 24 * 60 * 60 * 1000
export const WEEKS = 26

export interface UsageUser {
  id: string // an ObjectId, whose first four bytes are when it was made
  name: string
  email: string
  autoTrack: boolean
}

export interface UsageTrack {
  userId: string
  kind: 'passage' | 'chapter'
  passageType?: string // passages only
  year: number // a passage's from its passageDate; a chapter's own
  isRead: boolean
  trackDate: string
  updatedAt: string
  client: string | null
  clientVersion: string | null
}

type Platform = Client | 'unknown'
type ByPlatform = Record<Platform, number>
type ByPlan = Record<PassageType, number>

export interface OperatorTotals {
  accounts: number
  readLast7Days: number
  plansThisYear: ByPlan // people with a Day marked read this year, each plan
  readLast30DaysBy: ByPlatform // people who marked something, by the app it was marked in
}

export interface OperatorClient {
  client: Client
  clientVersion: string | null // the latest seen
}

export interface OperatorPerson {
  userId: string
  name: string
  email: string
  joinedAt: string
  lastReadAt: string | null // null: never marked anything read
  daysReadLast30: number
  daysThisYear: ByPlan
  chaptersThisYear: number
  autoTrack: boolean
  clients: OperatorClient[]
}

export interface OperatorWeek {
  week: string // the Monday it starts, yyyy-MM-dd, UTC
  newAccounts: number
  readers: number
  readersBy: ByPlatform
  days: ByPlan // Days marked read that week, each plan
  chapters: number // Read Chapters marked that week
}

export interface OperatorUsage {
  totals: OperatorTotals
  people: OperatorPerson[]
  weeks: OperatorWeek[]
}

const zeroPlatforms = (): ByPlatform => ({ios: 0, android: 0, web: 0, unknown: 0})
const zeroPlans = (): ByPlan => ({bible: 0, psalms: 0, proverbs: 0})

const platformOf = (track: UsageTrack): Platform =>
  CLIENT_VALUES.includes(track.client as Client) ? (track.client as Client) : 'unknown'

export const joinedAt = (id: string): Date => new Date(parseInt(id.slice(0, 8), 16) * 1000)

const dayOf = (time: number): string => new Date(time).toISOString().slice(0, 10)

// The Monday a time falls in, UTC.
const mondayOf = (time: number): string => {
  const date = new Date(time)
  const back = (date.getUTCDay() + 6) % 7

  return dayOf(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - back))
}

export const usage = (
  users: UsageUser[],
  tracks: UsageTrack[],
  leftOut: Set<string>,
  now: Date = new Date(),
): OperatorUsage => {
  const counted = users.filter((u) => !leftOut.has(u.id))
  const ids = new Set(counted.map((u) => u.id))
  const year = now.getUTCFullYear()
  const nowMs = now.getTime()
  const since7 = nowMs - 7 * DAY_MS
  const since30 = nowMs - 30 * DAY_MS

  const thisMonday = mondayOf(nowMs)
  const weekKeys: string[] = []

  for (let i = WEEKS - 1; i >= 0; i--) {
    weekKeys.push(dayOf(Date.parse(thisMonday) - i * 7 * DAY_MS))
  }

  const weeks = new Map<string, OperatorWeek & {readerSets: Record<Platform | 'all', Set<string>>}>(
    weekKeys.map((week) => [
      week,
      {
        week,
        newAccounts: 0,
        readers: 0,
        readersBy: zeroPlatforms(),
        days: zeroPlans(),
        chapters: 0,
        readerSets: {ios: new Set(), android: new Set(), web: new Set(), unknown: new Set(), all: new Set()},
      },
    ]),
  )

  const people = new Map<
    string,
    OperatorPerson & {days30: Set<string>; latest: Map<Client, {at: string; version: string | null}>}
  >()

  for (const user of counted) {
    const joined = joinedAt(user.id)
    const week = weeks.get(mondayOf(joined.getTime()))

    if (week) week.newAccounts++

    people.set(user.id, {
      userId: user.id,
      name: user.name,
      email: user.email,
      joinedAt: joined.toISOString(),
      lastReadAt: null,
      daysReadLast30: 0,
      daysThisYear: zeroPlans(),
      chaptersThisYear: 0,
      autoTrack: user.autoTrack,
      clients: [],
      days30: new Set(),
      latest: new Map(),
    })
  }

  const read7 = new Set<string>()
  const plansThisYear: Record<PassageType, Set<string>> = {bible: new Set(), psalms: new Set(), proverbs: new Set()}
  const read30By: Record<Platform, Set<string>> = {
    ios: new Set(),
    android: new Set(),
    web: new Set(),
    unknown: new Set(),
  }

  for (const track of tracks) {
    if (!ids.has(track.userId)) continue
    const person = people.get(track.userId)!
    const platform = platformOf(track)

    // The app each person has used, at the latest version seen - from any change, un-marks
    // included, since an un-mark is the app being used too.
    if (platform !== 'unknown') {
      const seen = person.latest.get(platform)

      if (!seen || track.updatedAt > seen.at) {
        person.latest.set(platform, {at: track.updatedAt, version: track.clientVersion})
      }
    }

    if (!track.isRead) continue
    const at = Date.parse(track.trackDate)

    if (track.year === year) {
      if (track.kind === 'chapter') {
        person.chaptersThisYear++
      } else if (PASSAGE_TYPE_VALUES.includes(track.passageType as PassageType)) {
        person.daysThisYear[track.passageType as PassageType]++
        plansThisYear[track.passageType as PassageType].add(track.userId)
      }
    }

    if (Number.isNaN(at) || at > nowMs + DAY_MS) continue

    if (!person.lastReadAt || at > Date.parse(person.lastReadAt)) person.lastReadAt = new Date(at).toISOString()
    if (at >= since7) read7.add(track.userId)

    if (at >= since30) {
      person.days30.add(dayOf(at))
      read30By[platform].add(track.userId)
    }

    const week = weeks.get(mondayOf(at))

    if (week) {
      week.readerSets[platform].add(track.userId)
      week.readerSets.all.add(track.userId)

      if (track.kind === 'chapter') {
        week.chapters++
      } else if (PASSAGE_TYPE_VALUES.includes(track.passageType as PassageType)) {
        week.days[track.passageType as PassageType]++
      }
    }
  }

  const sizes = <K extends string>(sets: Record<K, Set<string>>): Record<K, number> =>
    Object.fromEntries(Object.entries<Set<string>>(sets).map(([k, v]) => [k, v.size])) as Record<K, number>

  return {
    totals: {
      accounts: counted.length,
      readLast7Days: read7.size,
      plansThisYear: sizes(plansThisYear),
      readLast30DaysBy: sizes(read30By),
    },
    people: [...people.values()].map(({days30, latest, ...person}) => ({
      ...person,
      daysReadLast30: days30.size,
      clients: CLIENT_VALUES.filter((c) => latest.has(c)).map((client) => ({
        client,
        clientVersion: latest.get(client)!.version,
      })),
    })),
    weeks: [...weeks.values()].map(({readerSets, ...week}) => ({
      ...week,
      readers: readerSets.all.size,
      readersBy: {
        ios: readerSets.ios.size,
        android: readerSets.android.size,
        web: readerSets.web.size,
        unknown: readerSets.unknown.size,
      },
    })),
  }
}
