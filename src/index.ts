import axios from 'axios'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from 'passport'
import {
  OAuth2Strategy as GoogleStrategy,
  Profile
} from 'passport-google-oauth'
import { config } from './config'
import { Logger } from './utils'
// import { router } from './routes'

const app = express()
app.set('view engine', 'ejs')
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  })
)

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

if (!config.env.isDev) app.use(morgan('tiny'))
else app.use(morgan('dev'))

// router(app)
let userProfile: Profile
let access_token = ''

// ! Github
// Ref https://www.loginradius.com/blog/engineering/oauth-implemenation-using-node/

app.get('/github/callback', (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${config.env.githubClientId}&client_secret=${config.env.githubClientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: 'application/json'
    }
  }).then(response => {
    access_token = response.data.access_token
    res.redirect('/github/success')
  })
})

app.get('/github/success', function (_req, res) {
  axios({
    method: 'get',
    url: 'https://api.github.com/user',
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  }).then(response => {
    Logger.info(response.data)
    // res.json({ userData: response.data })
    res.render(`${__dirname}/views/github/success`, { userData: response.data })
  })
})

app.get('/github', function (_req, res) {
  res.render(`${__dirname}/views/github/index`, {
    client_id: config.env.githubClientId
  })
})

// ! Google
// Ref: https://www.loginradius.com/blog/engineering/google-authentication-with-nodejs-and-passportjs/

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj: Express.User, cb) {
  cb(null, obj)
})

app.get('/google', function (_req, res) {
  res.render(`${__dirname}/views/google/auth`)
})

app.get(
  '/google/success',
  (_req, res) =>
    res.render(`${__dirname}/views/google/success`, { data: userProfile })
  // res.json(userProfile)
)
app.get('/google/error', (_req, res) => res.send('error logging in'))

passport.use(
  new GoogleStrategy(
    {
      clientID: config.env.googleClientId,
      clientSecret: config.env.googleClientSecret,
      callbackURL: 'http://localhost:3000/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      Logger.info({
        accessToken,
        refreshToken,
        profile
      })

      userProfile = profile
      return done(null, userProfile)
    }
  )
)

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/google/error' }),
  function (_req, res) {
    // Successful authentication, redirect success.
    res.redirect('/google/success')
  }
)

app.listen(config.env.port, () =>
  Logger.info(`Server at localhost:${config.env.port}`)
)
