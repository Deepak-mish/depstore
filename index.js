/* eslint-disable no-unused-vars */
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
require('./utils/db.config')
const MongoStore = require('connect-mongo').default
const mongoDbConnection = require('./utils/db.config')

const passport = require('passport')
// to let passport know we have a strategy(means login in with facebook google or local i.e user or passsword)
require('./utils/authStrategies/localStrategy')

const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

// // for session storage to check how many times user coming like local storage
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'f60e4013df4fd720a290f16ddd4f0cd1e2bf4769',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    // mongoConnection: mongoDbConnection
    mongoUrl: 'mongodb://localhost:27017/x-store'
  })
}))

// initialize passport for front end
app.use(passport.initialize())
app.use(passport.session())

app.use('/', authRoutes)

app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1
  console.log(`${req.user}`)
  return res.render('index')
})

app.listen(3000, function () {
  console.log('server running at port 3000')
})

module.exports = app
