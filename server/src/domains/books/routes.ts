import config from '@src/common/config'
import {handleSuccess} from '@src/common/helpers'
import axios from 'axios'
import express, {Request, Response, Router} from 'express'

const router: Router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  // noinspection TypeScriptValidateTypes
  const {data} = await axios.get(`${config.bible.apiUrl}/bibles/${config.bible.bibleId}/books`, {
    params: {
      'include-chapters': true,
    },
    headers: {
      'api-key': config.bible.apiKey,
    },
  })

  handleSuccess(res, data.data)
})

export default router
