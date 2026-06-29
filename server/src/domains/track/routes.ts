import {handleError, handleSuccess} from '@src/common/helpers'
import {requireAuth} from '@src/common/middleware'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service, {ChapterInput, PassageInput} from './service'

const router: Router = express.Router()

router.use(requireAuth)

/*
 * GET: `/api/user/tracks?since=<ISO>`  -> incremental pull
 * RETURNS: { passages: PassageTrack[], chapters: ChapterTrack[] }
 *  - passages: current calendar year, changed since `since`
 *  - chapters: lifetime, changed since `since`
 */
router.get('/tracks', async (req: Request<unknown, unknown, unknown, {since?: string}>, res: Response) => {
  try {
    const tracks = await service.getAll(req.userId as string, req.query.since)

    handleSuccess(res, tracks)
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * PUT: `/api/user/tracks`  -> batch upsert (outbox drain). Idempotent, LWW by updatedAt.
 * PAYLOAD: {
 *   passages?: [{ passageDate, passageType, isRead, updatedAt }],
 *   chapters?: [{ book, chapter, isRead, updatedAt }]
 * }
 * RETURNS: resolved server state for the upserted keys.
 */
router.put(
  '/tracks',
  async (req: Request<unknown, unknown, {passages?: PassageInput[]; chapters?: ChapterInput[]}>, res: Response) => {
    try {
      const result = await service.upsertBatch(req.userId as string, req.body.passages || [], req.body.chapters || [])

      handleSuccess(res, result)
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

export default router
