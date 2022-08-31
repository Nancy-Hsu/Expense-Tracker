const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')
const exphbs = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const methodOverride = require('method-override')

const router = require('./routes')
const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers,
  helpers: {
    dateTransfer: function (date) {
      return date.toISOString().slice(0, 10)
    },
    makeOptions: function (categories, record) {
      const options = categories.map(category => {
        const selectedOption = record.categoryId.name
        const option = category.name
        if (selectedOption === option) {
          return `<option value='${category._id}' selected > ${category.name}</option >`
        }
         return `<option value='${category._id}'> ${category.name}</option >`
      }).join('')
      return options
    }
  }
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(router)

app.listen(port, () => {
  console.log(`express is listening on localhost:${port}`)
})
