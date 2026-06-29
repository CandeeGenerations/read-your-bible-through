import {handleError, handleSuccess} from '@src/common/helpers'
import {requireAuth, userIdOf} from '@src/common/middleware'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service from './service'

const router: Router = express.Router()

router.use(requireAuth)

/*
 * GET: `/api/user/me`  -> the authenticated user
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await service.getSingle(userIdOf(req))

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * PATCH:   `/api/user`  -> update the authenticated user (name, settings)
 * PAYLOAD: { name?: string, settings?: object }
 */
router.patch('/', async (req: Request<unknown, unknown, {name?: string; settings?: object}>, res: Response) => {
  try {
    const {name, settings} = req.body
    const user = await service.updateSelf(userIdOf(req), {name, settings})

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
