import client from '@src/common/client'
import {IException} from '@src/types/logger'

import {OperatorUsage, UsageTrack, usage} from './usage'

// Whether this account is an Operator. Written by hand into `Operator`, never by a route.
const isOperator = async (userId: string): Promise<boolean> =>
  (await client.operator.findUnique({where: {userId}, select: {id: true}})) !== null

// Everything below checks for itself, beside the route asking first.
const refuse: IException = {name: 'Forbidden', message: 'Only an Operator can see this', status: 403}

const getUsage = async (userId: string): Promise<OperatorUsage> => {
  if (!(await isOperator(userId))) throw refuse

  const [users, leftOut, passages, chapters] = await Promise.all([
    client.user.findMany({select: {id: true, name: true, email: true, settings: true}}),
    client.operatorLeavesOut.findMany({select: {userId: true}}),
    client.passageTrack.findMany({
      select: {
        userId: true,
        passageType: true,
        passageDate: true,
        isRead: true,
        trackDate: true,
        updatedAt: true,
        client: true,
        clientVersion: true,
      },
    }),
    client.chapterTrack.findMany({
      select: {
        userId: true,
        year: true,
        isRead: true,
        trackDate: true,
        updatedAt: true,
        client: true,
        clientVersion: true,
      },
    }),
  ])

  const tracks: UsageTrack[] = [
    ...passages
      .filter((p) => p.userId)
      .map((p) => ({
        userId: p.userId!,
        kind: 'passage' as const,
        passageType: p.passageType,
        year: Number(p.passageDate.slice(0, 4)),
        isRead: p.isRead,
        trackDate: p.trackDate,
        updatedAt: p.updatedAt,
        client: p.client,
        clientVersion: p.clientVersion,
      })),
    ...chapters
      .filter((c) => c.userId)
      .map((c) => ({
        userId: c.userId!,
        kind: 'chapter' as const,
        year: c.year,
        isRead: c.isRead,
        trackDate: c.trackDate,
        updatedAt: c.updatedAt,
        client: c.client,
        clientVersion: c.clientVersion,
      })),
  ]

  return usage(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      // Auto-Track is on unless the reader turned it off.
      autoTrack: (u.settings as {autoTrackChapters?: boolean} | null)?.autoTrackChapters !== false,
    })),
    tracks,
    new Set(leftOut.map((l) => l.userId)),
  )
}

export default {isOperator, getUsage}
