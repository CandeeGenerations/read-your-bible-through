import {verifyAppToken} from '@src/common/auth'
import client from '@src/common/client'
import {NextFunction, Request, Response} from 'express'

// userId is attached to the request by requireAuth. Read/written via these helpers
// (structural typing) rather than an ambient global augmentation, because ts-node-dev
// type-checks files in isolation and won't reliably load a separate `.d.ts`.
// `any` generics so any Request<...> from a typed handler is accepted.
// oxlint-disable-next-line typescript/no-explicit-any
export const userIdOf = (req: Request<any, any, any, any>): string => (req as {userId?: string}).userId as string

// Requires a valid Bearer app-JWT whose user still exists. Sets req.userId from the token's
// subject. Rejects with 401 (clients treat 401 as "pause sync + re-auth", never data loss).
//
// A token outlives a deleted account - it is valid for 90 days whoever it names - so the
// user is looked up too. Without that, another device still signed in to a deleted account
// would go on writing tracks for a user who no longer exists.
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized: missing bearer token')
    return
  }

  let userId: string

  try {
    userId = (await verifyAppToken(header.slice('Bearer '.length))).sub
  } catch {
    res.status(401).send('Unauthorized: invalid or expired token')
    return
  }

  if (!(await client.user.findFirst({where: {id: userId}, select: {id: true}}))) {
    res.status(401).send('Unauthorized: account no longer exists')
    return
  }

  ;(req as Request & {userId?: string}).userId = userId
  next()
}
