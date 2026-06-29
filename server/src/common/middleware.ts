import {verifyAppToken} from '@src/common/auth'
import {NextFunction, Request, Response} from 'express'

// userId is attached to the request by requireAuth. Read/written via these helpers
// (structural typing) rather than an ambient global augmentation, because ts-node-dev
// type-checks files in isolation and won't reliably load a separate `.d.ts`.
// `any` generics so any Request<...> from a typed handler is accepted.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userIdOf = (req: Request<any, any, any, any>): string => (req as {userId?: string}).userId as string

// Requires a valid Bearer app-JWT. Sets req.userId from the token's subject.
// Rejects with 401 (clients treat 401 as "pause sync + re-auth", never data loss).
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized: missing bearer token')
    return
  }

  try {
    const claims = await verifyAppToken(header.slice('Bearer '.length))

    ;(req as Request & {userId?: string}).userId = claims.sub
    next()
  } catch {
    res.status(401).send('Unauthorized: invalid or expired token')
  }
}
