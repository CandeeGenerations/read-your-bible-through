import {Prisma, SignInMethod, User} from '@prisma/client'
import {exchangeAuthorizationCode, revoke} from '@src/common/apple'
import {verifyProviderToken} from '@src/common/auth'
import client from '@src/common/client'
import {PROVIDERS, Provider} from '@src/common/constants'
import {logError, logInfo} from '@src/common/logger'
import {IException} from '@src/types/logger'

// A user as clients see them: with the ways they can sign in, and without anything
// credential-like - the Apple refresh tokens stay on the server.
export type PublicUser = User & {signInMethods: {provider: string; email: string | null}[]}

// A request that conflicts with the account as it is. Answered with 409 and `name: message`,
// the name being what the app tells the cases apart by.
const refusal = (name: string, message: string): IException => ({name, message, status: 409})

// Accounts made before sign-in methods existed have none until they next sign in. The server
// did record the first sign-in's provider and 'sub' on the user, which is exactly one method.
const ensureSignInMethods = async (user: User): Promise<SignInMethod[]> => {
  const methods = await client.signInMethod.findMany({where: {userId: user.id}})

  if (methods.length > 0 || !user.provider || !user.subject) return methods

  const existing = await client.signInMethod.findUnique({
    where: {provider_subject: {provider: user.provider, subject: user.subject}},
  })

  if (existing) return methods

  return [
    await client.signInMethod.create({
      data: {
        userId: user.id,
        provider: user.provider,
        subject: user.subject,
        email: user.email,
        addedAt: new Date().toISOString(),
      },
    }),
  ]
}

export const toPublicUser = async (user: User): Promise<PublicUser> => ({
  ...user,
  signInMethods: (await ensureSignInMethods(user)).map(({provider, email}) => ({provider, email})),
})

// The Apple refresh token for a sign-in's authorization code, as fields for a SignInMethod.
export const appleTokenFields = async (
  provider: Provider,
  authorizationCode: string | undefined,
  audience: string,
): Promise<{appleRefreshToken?: string; appleClientId?: string}> => {
  if (provider !== PROVIDERS.APPLE || !authorizationCode) return {}

  const appleRefreshToken = await exchangeAuthorizationCode(authorizationCode, audience)

  return appleRefreshToken ? {appleRefreshToken, appleClientId: audience} : {}
}

const revokeApple = async (methods: SignInMethod[]): Promise<void> => {
  for (const method of methods) {
    if (method.provider !== PROVIDERS.APPLE || !method.appleRefreshToken || !method.appleClientId) continue

    if (!(await revoke(method.appleRefreshToken, method.appleClientId))) {
      logError('Sign in with Apple could not be revoked', {userId: method.userId, signInMethodId: method.id})
    }
  }
}

const getSingle = async (id: string): Promise<User | null> => await client.user.findFirst({where: {id}})

const getSingleByEmail = async (email: string): Promise<User | null> => await client.user.findFirst({where: {email}})

// Self-update for the authenticated user. Only name + settings are mutable here.
const updateSelf = async (id: string, {name, settings}: {name?: string; settings?: object}): Promise<User> => {
  const data: Prisma.UserUpdateInput = {}

  if (name !== undefined) data.name = name
  if (settings !== undefined) data.settings = settings as Prisma.InputJsonValue

  return await client.user.update({where: {id}, data})
}

// Adds a way to sign in to the authenticated user's account: signed in with Google, add Sign
// in with Apple, or the reverse. Linking only, never merging (ADR 0004 in the iOS app), so it
// refuses rather than take a sign-in that already reaches someone else's account.
const addSignInMethod = async (
  userId: string,
  provider: Provider,
  idToken: string,
  nonce: string | undefined,
  authorizationCode: string | undefined,
): Promise<User> => {
  const identity = await verifyProviderToken(provider, idToken, nonce)
  const user = (await client.user.findFirst({where: {id: userId}})) as User
  const existing = await client.signInMethod.findUnique({
    where: {provider_subject: {provider, subject: identity.subject}},
  })

  if (existing) {
    if (existing.userId === userId) return user // added already - nothing to do

    throw refusal('SignInMethodInUse', 'That sign-in already opens a different account')
  }

  if ((await ensureSignInMethods(user)).some((method) => method.provider === provider)) {
    throw refusal('ProviderAlreadyAdded', `This account already has a ${provider} sign-in`)
  }

  // Its email would join that other account on a first sign-in, so the two would disagree
  // about whose it is. The same refusal.
  const emailOwner = identity.emailVerified ? await client.user.findFirst({where: {email: identity.email}}) : null

  if (emailOwner && emailOwner.id !== userId) {
    throw refusal('EmailInUse', "That sign-in's email belongs to a different account")
  }

  await client.signInMethod.create({
    data: {
      userId,
      provider,
      subject: identity.subject,
      email: identity.email,
      addedAt: new Date().toISOString(),
      ...(await appleTokenFields(provider, authorizationCode, identity.audience)),
    },
  })
  logInfo('Sign-in method added', {userId, provider})

  return user
}

// Removes a way to sign in, and revokes it with Apple if it was Sign in with Apple. Never the
// last one: an account nobody can sign in to is deleted, not stranded.
const removeSignInMethod = async (userId: string, provider: string): Promise<User> => {
  const user = (await client.user.findFirst({where: {id: userId}})) as User
  const methods = await ensureSignInMethods(user)
  const removing = methods.filter((method) => method.provider === provider)

  if (removing.length === 0) return user

  if (removing.length === methods.length) {
    throw refusal('LastSignInMethod', 'An account needs at least one way to sign in')
  }

  await revokeApple(removing)
  await client.signInMethod.deleteMany({where: {id: {in: removing.map((method) => method.id)}}})

  // The old single-sign-in record, if it names what was removed: sign-in still matches
  // accounts by it, and would let the removed method straight back in.
  if (user.subject && removing.some((method) => method.subject === user.subject)) {
    await client.user.update({where: {id: userId}, data: {subject: null}})
  }
  logInfo('Sign-in method removed', {userId, provider})

  return user
}

// Deletes the authenticated user and everything saved with them, and revokes every Sign in
// with Apple of theirs - what App Store Guideline 5.1.1(v) asks of in-app deletion. The
// deletion does not wait on Apple: a revocation that fails is logged, and the account is
// deleted all the same, rather than left in place because Apple did not answer.
const deleteSelf = async (id: string): Promise<void> => {
  const user = await client.user.findFirst({where: {id}})

  if (!user) return

  await revokeApple(await client.signInMethod.findMany({where: {userId: id}}))

  // One after another rather than in a transaction, which Prisma allows on MongoDB only
  // against a replica set. The user goes last, so a deletion cut off part-way leaves them
  // able to sign in and delete again, and nothing of theirs without an owner.
  await client.passageTrack.deleteMany({where: {userId: id}})
  await client.chapterTrack.deleteMany({where: {userId: id}})
  await client.signInMethod.deleteMany({where: {userId: id}})
  await client.user.delete({where: {id}})
  logInfo('Account deleted', {userId: id})
}

export default {getSingle, getSingleByEmail, updateSelf, addSignInMethod, removeSignInMethod, deleteSelf}
