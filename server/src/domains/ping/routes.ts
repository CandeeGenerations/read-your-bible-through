import express, {Request, Response} from 'express'
import {handleSuccess} from '../../common/helpers.js'

export default express
  .Router()
  .get('/', async (req: Request, res: Response) => {
    handleSuccess(res, {ping: 'pong'})
  })
