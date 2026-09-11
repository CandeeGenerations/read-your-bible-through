import {Prisma, User} from '@prisma/client'
import {revoke} from '@src/common/apple'
import client from '@src/common/client'
import {logError, logInfo} from '@src/common/logger'

// A user as clients see them: without the Apple refresh token, which is a credential.
export type PublicUser = Omit<User, 'appleRefreshToken' | 'appleClientId'>

export const toPublicUser = (user: User): PublicUser => {
  const shown: Partial<User> = {...user}

  delete shown.appleRefreshToken
  delete shown.appleClientId

  return shown as PublicUser
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

// Deletes the authenticated user and everything saved with them, and revokes their Sign in
// with Apple if they used it - what App Store Guideline 5.1.1(v) asks of in-app deletion.
// The deletion does not wait on Apple: a revocation that fails is logged, and the account
// is deleted all the same, rather than left in place because Apple did not answer.
const deleteSelf = async (id: string): Promise<void> => {
  const user = await client.user.findFirst({where: {id}})

  if (!user) return

  if (user.appleRefreshToken && user.appleClientId) {
    const revoked = await revoke(user.appleRefreshToken, user.appleClientId)

    if (!revoked) logError('Deleting an account whose Apple sign-in could not be revoked', {userId: id})
  }

  // One after another rather than in a transaction, which Prisma allows on MongoDB only
  // against a replica set. The user goes last, so a deletion cut off part-way leaves them
  // able to sign in and delete again, and nothing of theirs without an owner.
  await client.passageTrack.deleteMany({where: {userId: id}})
  await client.chapterTrack.deleteMany({where: {userId: id}})
  await client.user.delete({where: {id}})
  logInfo('Account deleted', {userId: id})
}

export default {getSingle, getSingleByEmail, updateSelf, deleteSelf}
