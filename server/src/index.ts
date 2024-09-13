import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'

import config from './common/config'
import booksRoutes from './domains/books/routes'
import pingRoutes from './domains/ping/routes'
import trackRoutes from './domains/track/routes'
import userRoutes from './domains/user/routes'

const app = express()
const {port} = config
const pjson = JSON.parse(
  // eslint-disable-next-line no-undef
  fs.readFileSync(path.join(__dirname, '../', 'package.json'), 'utf8'),
)
const sep = ' -------------------------------------'

app.use(express.json({limit: '50mb'}))
app.use(cors())

console.log(`
   _____    _____
  / ____|  / ____|
 | |      | |  __  ___ _ __
 | |      | | |_ |/ _ \\ '_ \\
 | |____  | |__| |  __/ | | |
  \\_____|  \\_____|\\___|_| |_|

${sep}
 Read Your Bible Through Server | v${pjson.version || '_dev'}
 🚀 Server ready on PORT: ${port}
${sep}
 Routes:`)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanseRouteName = (routeObject: any): string => {
  const routeName = Object.keys(routeObject)[0]

  return routeName
    .replace('Routes', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useRoute = (routeObject: any, parentRouteName?: string): void => {
  const routeName = cleanseRouteName(routeObject)
  const route = `/api/${parentRouteName ? `${parentRouteName}/` : ''}${routeName}`

  console.log(` - ${route}`)

  // noinspection TypeScriptValidateTypes
  app.use(route, routeObject[Object.keys(routeObject)[0]])
}

for (const routeObject of [{pingRoutes}, {userRoutes}, {booksRoutes}]) {
  useRoute(routeObject)

  if (cleanseRouteName(routeObject) === 'user') {
    console.log(' - /api/user/:userId/track')

    app.use('/api/user', trackRoutes)
  }
}

console.log(sep)

app.listen(port)
