import axios from 'axios'
import express, {Request, Response} from 'express'
import config from '../../common/config.js'
import {handleSuccess} from '../../common/helpers.js'

export default express
  .Router()
  .get('/', async (req: Request, res: Response) => {
    // noinspection TypeScriptValidateTypes
    const {data} = await axios.get(
      `${config.bible.apiUrl}/bibles/${config.bible.bibleId}/books`,
      {
        params: {
          'include-chapters': true,
        },
        headers: {
          'api-key': config.bible.apiKey,
        },
      },
    )

    handleSuccess(res, data.data)
  })
