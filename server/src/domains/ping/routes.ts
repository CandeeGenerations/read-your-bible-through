import {handleSuccess} from '@src/common/helpers'
import express, {Response, Router} from 'express'

const router: Router = express.Router()

router.get('/', async (_, res: Response) => {
  handleSuccess(res, {ping: 'pong'})
})

export default router
