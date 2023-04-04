import {PassageTrack} from '@prisma/client'
import dayjs from 'dayjs'
import express, {Request, Response} from 'express'
import {handleError, handleSuccess} from '../../common/helpers'
import {IException} from '../../types/logger'
import service from './service'

const route = '/:userId/track'

export default express
  .Router()

  /*
   * GET:   `/api/user/:userId/tracks`
   * QUERY:
   *        - :userId : `641546e3e6dffedba604e2b3`
   */
  .get(`${route}s`, async (req: Request<{userId: string}>, res: Response) => {
    try {
      const tracks = await service.getAll(req.params.userId)

      handleSuccess(res, tracks)
    } catch (e) {
      handleError(res, e as IException)
    }
  })

  /*
   * POST:    `/api/user/:userId/track/:trackId?`
   * QUERY:
   *          - :userId   : `641546e3e6dffedba604e2b3`
   *          - :trackId? : `641546e3e6dffedba604e2b3`
   * PAYLOAD: {passageDate: '2023-01-01'}
   */
  .post(
    `${route}/:trackId?`,
    async (req: Request<{userId: string; trackId?: string}>, res: Response) => {
      try {
        const {trackId, userId} = req.params

        if (trackId) {
          const currentTrack = await service.getSingle(trackId)

          if (!currentTrack) {
            handleError(res, {
              name: 'Passage Track not found',
              message: 'Passage Track not found',
            })
            return
          }

          await service.remove(trackId)

          handleSuccess(res)
          return
        }

        await service.create({
          passageDate: req.body.passageDate,
          userId,
          trackDate: dayjs().format(),
        } as PassageTrack)

        handleSuccess(res)
      } catch (e) {
        handleError(res, e as IException)
      }
    },
  )
