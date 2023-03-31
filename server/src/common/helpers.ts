import {Response} from 'express'
import {IException} from '../types/logger'
import {logError} from './logger'

export const handleError = (res: Response, error: IException): Response => {
  logError(error.message, error)

  return res.status(500).send(`${error.name}: ${error.message}`)
}

export const handleSuccess = (res: Response, data?: any): Response =>
  res.status(200).send(data)
