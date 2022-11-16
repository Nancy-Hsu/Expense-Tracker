const express = require('express')
require('express-async-errors')
const session = require('express-session')
const Store = require('express-session').Store;
const MongooseStore = require('mongoose-express-session')(Store)
const usePassport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// require('./config/mongoose')
const { mongoose } = require('./config/mongoose')
const exphbs = require('express-handlebars')
const { helpers } = require('./helpers/hbs-helpers')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const router = require('./routes')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: new MongooseStore({
     connection: mongoose
  })
}))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(router)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
