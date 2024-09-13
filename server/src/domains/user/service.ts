import {User} from '@prisma/client'
import client from '@src/common/client'

const getAll = async (): Promise<User[]> => await client.user.findMany()

const getSingle = async (id: string): Promise<User | null> => await client.user.findFirst({where: {id}})

const getSingleByEmail = async (email: string): Promise<User | null> => await client.user.findFirst({where: {email}})

const create = async (data: User): Promise<User> => await client.user.create({data})

const update =
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: User): Promise<User> => await client.user.update({where: {id}, data})

const remove = async (id: string): Promise<User> => await client.user.delete({where: {id}})

export default {getAll, getSingle, getSingleByEmail, create, update, remove}
