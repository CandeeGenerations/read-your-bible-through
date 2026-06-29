import {handleError, handleSuccess} from '@src/common/helpers'
import {requireAuth} from '@src/common/middleware'
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
    const user = await service.getSingle(req.userId as string)

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
    const user = await service.updateSelf(req.userId as string, {name, settings})

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
