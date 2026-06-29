import {verifyAppToken} from '@src/common/auth'
import {NextFunction, Request, Response} from 'express'

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

    req.userId = claims.sub
    next()
  } catch {
    res.status(401).send('Unauthorized: invalid or expired token')
  }
}
