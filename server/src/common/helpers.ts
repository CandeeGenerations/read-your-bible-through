import {Response} from 'express'
import {IException} from '../types/logger.js'
import {logError} from './logger.js'

export const handleError = (res: Response, error: IException): Response => {
  logError(error.message, error)

  return res.status(500).send(`${error.name}: ${error.message}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSuccess = (res: Response, data?: any): Response =>
  res.status(200).send(data)
