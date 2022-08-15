import { Application } from 'express'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import { config } from '../config'

const swaggerDocument = YAML.load(config.constants.SWAGGER_PATH)

export const router = (server: Application): void => {
  server.get('/', (_req, res) =>
    res.redirect(`${config.constants.BASE_URL_API}/docs`)
  )
  server.use(
    `${config.constants.BASE_URL_API}/docs`,
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
  )
}
