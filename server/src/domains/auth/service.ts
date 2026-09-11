import {User} from '@prisma/client'
import {ProviderIdentity, signAppToken, verifyProviderToken} from '@src/common/auth'
import client from '@src/common/client'
import {Provider} from '@src/common/constants'
import {PublicUser, appleTokenFields, toPublicUser} from '@src/domains/user/service'
import {IException} from '@src/types/logger'

// Verify the provider ID token, find the account it opens, and issue our own JWT. The
// account is found by its sign-in method first - this Apple ID, this Google account - and
// only then by email, and by email only when the provider has verified it (ADR 0004 in the
// iOS app's repo). A sign-in that finds neither makes a new account.
//
// `name` is supplied separately for Apple, whose id_token carries no name claim (Apple
// returns the user's name only in the first authorization payload). `authorizationCode` is
// Apple's too, sent by the app: exchanged now for a refresh token, kept on the sign-in
// method only to revoke it later.
const authenticate = async (
  provider: Provider,
  idToken: string,
  nonce: string | undefined,
  name: string | undefined,
  authorizationCode?: string,
): Promise<{token: string; user: PublicUser}> => {
  const identity: ProviderIdentity = await verifyProviderToken(provider, idToken, nonce)
  const resolvedName = identity.name || name
  const apple = await appleTokenFields(provider, authorizationCode, identity.audience)

  const method = await client.signInMethod.findUnique({
    where: {provider_subject: {provider, subject: identity.subject}},
  })
  let user: User | null = method ? await client.user.findFirst({where: {id: method.userId}}) : null

  if (method && Object.keys(apple).length > 0) {
    await client.signInMethod.update({where: {id: method.id}, data: apple})
  }

  if (!user) {
    // An account from before sign-in methods, found by the provider 'sub' it recorded on its
    // first sign-in. That proves who this is without the email, so an existing website user
    // is never turned away by the verified-email rule below.
    const legacy = await client.user.findFirst({where: {subject: identity.subject}})
    const byEmail = legacy ?? (await client.user.findFirst({where: {email: identity.email}}))

    if (byEmail && !legacy && !identity.emailVerified) {
      throw {
        name: 'EmailNotVerified',
        message: 'That email address belongs to an account, and the provider has not verified it',
        status: 409,
      } as IException
    }

    user =
      byEmail ??
      (await client.user.create({
        data: {
          email: identity.email,
          // Apple sends the name only on first authorization — persist it now or lose it.
          name: resolvedName || identity.email,
          provider,
          // No `subject`: that is the old single-sign-in record, and the sign-in method
          // below says the same. Kept, it would let a removed method back in (see legacy).
        },
      }))

    // A matching verified email joins the account, and this sign-in becomes one of its ways
    // in, so a later change of email on either side does not strand it.
    await client.signInMethod.create({
      data: {
        userId: user.id,
        provider,
        subject: identity.subject,
        email: identity.email,
        addedAt: new Date().toISOString(),
        ...apple,
      },
    })
  }

  // Only upgrade an empty/email-placeholder name; always record the latest login method.
  const shouldSetName = resolvedName && (!user.name || user.name === user.email)

  user = await client.user.update({
    where: {id: user.id},
    data: {provider, ...(shouldSetName ? {name: resolvedName} : {})},
  })

  const token = await signAppToken({sub: user.id, email: user.email})

  return {token, user: await toPublicUser(user)}
}

export default {authenticate}
