import {PROVIDER_VALUES, Provider} from '@src/common/constants'
import {handleError, handleSuccess} from '@src/common/helpers'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service from './service'

const router: Router = express.Router()

/*
 * POST:    `/api/auth`
 * PAYLOAD: { provider: 'apple' | 'google', idToken: string, nonce?: string, name?: string }
 *          - name: supplied for Apple first sign-in (id_token has no name claim)
 * RETURNS: { token, user }
 */
router.post(
  '/',
  async (
    req: Request<unknown, unknown, {provider?: string; idToken?: string; nonce?: string; name?: string}>,
    res: Response,
  ) => {
    try {
      const {provider, idToken, nonce, name} = req.body

      if (!provider || !PROVIDER_VALUES.includes(provider as Provider) || !idToken) {
        handleError(res, {name: 'Bad request', message: 'valid provider and idToken are required'})
        return
      }

      const result = await service.authenticate(provider as Provider, idToken, nonce, name)

      handleSuccess(res, result)
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

export default router
