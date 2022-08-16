import 'dotenv/config'
import path from 'path'

const {
  NODE_ENV,
  PORT,
  URL_API,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env

export const config = {
  env: {
    isDev: NODE_ENV !== 'production',
    port: Number(PORT),
    githubClientId: GITHUB_CLIENT_ID ?? '',
    githubClientSecret: GITHUB_CLIENT_SECRET ?? '',
    googleClientId: GOOGLE_CLIENT_ID ?? '',
    googleClientSecret: GOOGLE_CLIENT_SECRET ?? ''
  },
  constants: {
    BASE_URL_API: '/api/v1',
    URL_API,
    SWAGGER_PATH: path.resolve(__dirname, '../../swagger.yaml')
  }
}
