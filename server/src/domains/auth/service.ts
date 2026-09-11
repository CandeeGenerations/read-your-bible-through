import {exchangeAuthorizationCode} from '@src/common/apple'
import {ProviderIdentity, signAppToken, verifyProviderToken} from '@src/common/auth'
import client from '@src/common/client'
import {PROVIDERS, Provider} from '@src/common/constants'
import {PublicUser, toPublicUser} from '@src/domains/user/service'

// Verify provider ID token -> find-or-create user by email -> issue app JWT.
// `name` is supplied separately for Apple, whose id_token carries no name claim
// (Apple returns the user's name only in the first authorization payload).
// `authorizationCode` is Apple's too, sent by the app: exchanged now for a refresh token,
// kept only to revoke the user's Apple sign-in if they delete their account.
const authenticate = async (
  provider: Provider,
  idToken: string,
  nonce: string | undefined,
  name: string | undefined,
  authorizationCode?: string,
): Promise<{token: string; user: PublicUser}> => {
  const identity: ProviderIdentity = await verifyProviderToken(provider, idToken, nonce)
  const resolvedName = identity.name || name
  const appleRefreshToken =
    provider === PROVIDERS.APPLE && authorizationCode
      ? await exchangeAuthorizationCode(authorizationCode, identity.audience)
      : undefined
  const apple = appleRefreshToken ? {appleRefreshToken, appleClientId: identity.audience} : {}

  let user = await client.user.findFirst({where: {email: identity.email}})

  if (!user) {
    user = await client.user.create({
      data: {
        email: identity.email,
        // Apple sends the name only on first authorization — persist it now or lose it.
        name: resolvedName || identity.email,
        provider, // login method
        subject: identity.subject,
        ...apple,
      },
    })
  } else {
    // Only upgrade an empty/email-placeholder name; always record the latest login method.
    const shouldSetName = resolvedName && (!user.name || user.name === user.email)

    user = await client.user.update({
      where: {id: user.id},
      data: {
        provider, // login method used this sign-in
        subject: user.subject || identity.subject,
        ...(shouldSetName ? {name: resolvedName} : {}),
        ...apple,
      },
    })
  }

  const token = await signAppToken({sub: user.id, email: user.email})

  return {token, user: toPublicUser(user)}
}

export default {authenticate}
