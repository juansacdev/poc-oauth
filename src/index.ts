import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { router } from './routes'
import { Logger } from './utils'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!config.env.isDev) app.use(morgan('tiny'))
else app.use(morgan('dev'))

router(app)

app.listen(config.env.port, () =>
  Logger.info(`Server at localhost:${config.env.port}`)
)
