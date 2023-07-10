import {User} from '@prisma/client'
import express, {Request, Response} from 'express'
import {handleError, handleSuccess} from '../../common/helpers'
import {IException} from '../../types/logger'
import service from './service'

export default express
  .Router()

  /*
   * GET:   `/api/user/email?email=`
   * QUERY:
   *        - ?email : `john@doe.com`
   */
  .get('/email', async (req: Request, res: Response) => {
    try {
      const user = await service.getSingleByEmail(req.query.email as string)

      console.log('Found user :', user)

      handleSuccess(res, user)
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/user`
   * PAYLOAD: User
   */
  .post('/', async (req: Request, res: Response) => {
    try {
      console.log('Creating user...')
      const newUser: User = req.body
      const user = await service.create(newUser)

      handleSuccess(res, user)
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
  .post('/:userId', async (req: Request<{userId: string}>, res: Response) => {
    try {
      console.log('Getting user...', req.params.userId)
      const updatedUser: User = req.body
      const id: string = req.params.userId
      let user = await service.getSingle(id)

      if (!user) {
        handleError(res, {name: 'User not found', message: 'User not found'})
        return
      }

      user = {...user, ...updatedUser}

      await service.update(id, user)

      handleSuccess(res, user)
    } catch (e) {
      handleError(res, e as IException)
    }
  })
