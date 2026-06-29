import {Prisma, User} from '@prisma/client'
import client from '@src/common/client'

const getSingle = async (id: string): Promise<User | null> => await client.user.findFirst({where: {id}})

const getSingleByEmail = async (email: string): Promise<User | null> => await client.user.findFirst({where: {email}})

// Self-update for the authenticated user. Only name + settings are mutable here.
const updateSelf = async (id: string, {name, settings}: {name?: string; settings?: object}): Promise<User> => {
  const data: Prisma.UserUpdateInput = {}

  if (name !== undefined) data.name = name
  if (settings !== undefined) data.settings = settings as Prisma.InputJsonValue

  return await client.user.update({where: {id}, data})
}

export default {getSingle, getSingleByEmail, updateSelf}
