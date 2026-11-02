import {handleError, handleSuccess} from '@src/common/helpers'
import {requireAuth, userIdOf} from '@src/common/middleware'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service from './service'

// The Operator: who can see how the app is used. Look only - nothing here writes.
// docs/operator-plan.md in the app's repo.
const router: Router = express.Router()

router.use(requireAuth)

/*
 * GET: `/api/operator`  -> whether the signed-in account is an Operator
 * RETURNS: { isOperator: boolean } - and nothing else, so it tells anybody else nothing
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    handleSuccess(res, {isOperator: await service.isOperator(userIdOf(req))})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * GET: `/api/operator/usage`  -> how the app is used, for an Operator only (403 otherwise)
 * RETURNS: { totals, people, weeks } - see ./usage.ts. Counts only, never a Day or a chapter.
 */
router.get('/usage', async (req: Request, res: Response) => {
  try {
    handleSuccess(res, await service.getUsage(userIdOf(req)))
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
