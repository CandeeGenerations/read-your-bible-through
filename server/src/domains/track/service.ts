import {PassageTrack} from '@prisma/client'
import client from '@src/common/client'
import dayjs from 'dayjs'

const getAll = async (userId: string): Promise<PassageTrack[]> =>
  await client.passageTrack.findMany({
    where: {
      AND: [
        {userId},
        {
          trackDate: {
            gte: dayjs().startOf('year').format(),
            lte: dayjs().endOf('year').format(),
          },
        },
      ],
    },
  })

const getSingle = async (id: string): Promise<PassageTrack | null> => await client.passageTrack.findFirst({where: {id}})

const create = async (data: PassageTrack): Promise<PassageTrack> => await client.passageTrack.create({data})

const update =
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (id: string, {id: _, ...data}: PassageTrack): Promise<PassageTrack> =>
    await client.passageTrack.update({where: {id}, data})

const remove = async (id: string): Promise<PassageTrack> => await client.passageTrack.delete({where: {id}})

export default {getAll, getSingle, create, update, remove}
