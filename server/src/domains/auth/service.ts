import {User} from '@prisma/client'
import {ProviderIdentity, signAppToken, verifyProviderToken} from '@src/common/auth'
import client from '@src/common/client'
import {Provider} from '@src/common/constants'

// Verify provider ID token -> find-or-create user by email -> issue app JWT.
// `name` is supplied separately for Apple, whose id_token carries no name claim
// (Apple returns the user's name only in the first authorization payload).
const authenticate = async (
  provider: Provider,
  idToken: string,
  nonce: string | undefined,
  name: string | undefined,
): Promise<{token: string; user: User}> => {
  const identity: ProviderIdentity = await verifyProviderToken(provider, idToken, nonce)
  const resolvedName = identity.name || name

  let user = await client.user.findFirst({where: {email: identity.email}})

  if (!user) {
    user = await client.user.create({
      data: {
        email: identity.email,
        // Apple sends the name only on first authorization — persist it now or lose it.
        name: resolvedName || identity.email,
        provider, // login method
        subject: identity.subject,
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
      },
    })
  }

  const token = await signAppToken({sub: user.id, email: user.email})

  return {token, user}
}

export default {authenticate}
