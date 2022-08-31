const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')
const exphbs = require('express-handlebars')
const helpers = require('handlebars-helpers')()

const router = require('./routes')

const app = express()
const port = 3000



app.engine('hbs', exphbs.engine({
  defaultLayout: 'main', extname: '.hbs', helpers: {
    dateTransfer: function (date) {
      return date.toISOString().slice(0, 10)
    }
  }
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended:true }))
app.use(express.static('public'))








app.use(router)

app.listen(port, () => {
  console.log(`express is listening on localhost:${port}`)
})