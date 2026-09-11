import {PROVIDER_VALUES, Provider} from '@src/common/constants'
import {handleError, handleSuccess} from '@src/common/helpers'
import {requireAuth, userIdOf} from '@src/common/middleware'
import {IException} from '@src/types/logger'
import express, {Request, Response, Router} from 'express'

import service, {toPublicUser} from './service'

const router: Router = express.Router()

router.use(requireAuth)

/*
 * GET: `/api/user/me`  -> the authenticated user
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await service.getSingle(userIdOf(req))

    handleSuccess(res, {user: user && (await toPublicUser(user))})
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

    handleSuccess(res, {user: await toPublicUser(user)})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * POST:    `/api/user/sign-in-methods`  -> add a way to sign in to the authenticated user's account
 * PAYLOAD: { provider: 'apple' | 'google', idToken: string, nonce?: string, authorizationCode?: string }
 * RETURNS: { user } with its signInMethods
 * 409:     SignInMethodInUse, EmailInUse or ProviderAlreadyAdded - never merged (ADR 0004 in the app)
 */
router.post(
  '/sign-in-methods',
  async (
    req: Request<unknown, unknown, {provider?: string; idToken?: string; nonce?: string; authorizationCode?: string}>,
    res: Response,
  ) => {
    try {
      const {provider, idToken, nonce, authorizationCode} = req.body

      if (!provider || !PROVIDER_VALUES.includes(provider as Provider) || !idToken) {
        handleError(res, {name: 'Bad request', message: 'valid provider and idToken are required', status: 400})
        return
      }

      const user = await service.addSignInMethod(userIdOf(req), provider as Provider, idToken, nonce, authorizationCode)

      handleSuccess(res, {user: await toPublicUser(user)})
    } catch (e) {
      handleError(res, e as IException)
    }
  },
)

/*
 * DELETE:  `/api/user/sign-in-methods/:provider`  -> remove a way to sign in, revoking it with Apple
 * RETURNS: { user } with its signInMethods
 * 409:     LastSignInMethod - the last one goes only with the account
 */
router.delete('/sign-in-methods/:provider', async (req: Request<{provider: string}>, res: Response) => {
  try {
    const user = await service.removeSignInMethod(userIdOf(req), req.params.provider)

    handleSuccess(res, {user: await toPublicUser(user)})
  } catch (e) {
    handleError(res, e as IException)
  }
})

/*
 * DELETE:  `/api/user`  -> delete the authenticated user, their tracks, and their Apple sign-in
 * RETURNS: { deleted: true }
 */
router.delete('/', async (req: Request, res: Response) => {
  try {
    await service.deleteSelf(userIdOf(req))

    handleSuccess(res, {deleted: true})
  } catch (e) {
    handleError(res, e as IException)
  }
})

export default router
