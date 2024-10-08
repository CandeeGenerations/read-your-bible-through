import {User} from '@prisma/client'
import {handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service from './service'

const router: Router = express.Router()

/*
 * GET:   `/api/user/email?email=`
 * QUERY:
 *        - ?email : `john@doe.com`
 */
router.get('/email', async (req: Request, res: Response) => {
  try {
    const user = await service.getSingleByEmail(req.query.email as string)

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/user`
 * PAYLOAD: User
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body
    const user = await service.create(newUser)

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/user/:userId`
 * QUERY:
 *          - :userId : `641546e3e6dffedba604e2b3`
 * PAYLOAD: User
 */
router.post('/:userId', async (req: Request<{userId: string}>, res: Response) => {
  try {
    const updatedUser: User = req.body
    const id: string = req.params.userId
    let user = await service.getSingle(id)

    if (!user) {
      handleError(res, {name: 'User not found', message: 'User not found'})
      return
    }

    user = {...user, ...updatedUser}

    await service.update(id, user)

    handleSuccess(res, {user})
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
