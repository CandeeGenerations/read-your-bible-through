import config from '@src/common/config'
import {logError, logInfo} from '@src/common/logger'
import {SignJWT, importPKCS8} from 'jose'

// Sign in with Apple's REST API, for the one thing the server needs it for: revoking a user's
// Apple sign-in when they delete their account, which App Review requires (Guideline
// 5.1.1(v)). Deleting our own user is not enough - the app would still be listed under
// "Sign in with Apple" in the person's Apple ID settings.
//
// Revoking needs a token Apple issued, and the only way to get one is the authorization
// code the app receives at sign-in. It lives about five minutes and is never offered again,
// so it is exchanged at sign-in (`exchangeAuthorizationCode`) and the refresh token kept on
// the user until deletion (`revoke`).

const APPLE = 'https://appleid.apple.com'

export const isAppleKeyConfigured = (): boolean =>
  Boolean(config.auth.apple.teamId && config.auth.apple.keyId && config.auth.apple.privateKey)

// Apple's "client secret": a short-lived JWT signed with the team's Sign in with Apple key.
export const appleClientSecret = async (clientId: string): Promise<string> => {
  const {teamId, keyId, privateKey} = config.auth.apple
  const key = await importPKCS8(privateKey as string, 'ES256')

  return await new SignJWT({})
    .setProtectedHeader({alg: 'ES256', kid: keyId as string})
    .setIssuer(teamId as string)
    .setIssuedAt()
    .setExpirationTime('5m')
    .setAudience(APPLE)
    .setSubject(clientId)
    .sign(key)
}

const post = async (path: string, form: Record<string, string>): Promise<Response> =>
  await fetch(`${APPLE}${path}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams(form).toString(),
  })

// Exchanges the sign-in's authorization code for a refresh token. Best effort: a failure
// here must not fail the sign-in, so it answers undefined and logs why.
export const exchangeAuthorizationCode = async (code: string, clientId: string): Promise<string | undefined> => {
  if (!isAppleKeyConfigured()) {
    logInfo('Apple authorization code not exchanged: APPLE_TEAM_ID, APPLE_KEY_ID or APPLE_PRIVATE_KEY is not set')
    return undefined
  }

  try {
    const response = await post('/auth/token', {
      client_id: clientId,
      client_secret: await appleClientSecret(clientId),
      code,
      grant_type: 'authorization_code',
    })
    const body = (await response.json()) as {refresh_token?: string; error?: string}

    if (!response.ok || !body.refresh_token) {
      logError('Apple authorization code exchange failed', {status: response.status, error: body.error})
      return undefined
    }

    return body.refresh_token
  } catch (e) {
    logError('Apple authorization code exchange failed', e)
    return undefined
  }
}

// Revokes a refresh token, which ends the app's Sign in with Apple for that person. Answers
// whether Apple accepted it.
export const revoke = async (refreshToken: string, clientId: string): Promise<boolean> => {
  if (!isAppleKeyConfigured()) {
    logError('Apple sign-in not revoked: APPLE_TEAM_ID, APPLE_KEY_ID or APPLE_PRIVATE_KEY is not set')
    return false
  }

  try {
    const response = await post('/auth/revoke', {
      client_id: clientId,
      client_secret: await appleClientSecret(clientId),
      token: refreshToken,
      token_type_hint: 'refresh_token',
    })

    if (!response.ok) {
      logError('Apple sign-in revocation failed', {status: response.status, body: await response.text()})
      return false
    }

    return true
  } catch (e) {
    logError('Apple sign-in revocation failed', e)
    return false
  }
}
