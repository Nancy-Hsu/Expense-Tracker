const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')
const exphbs = require('express-handlebars')

const router = require('./routes')

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))




app.use(router)




app.listen(port, () => {
  console.log(`express is listening on localhost:${port}`)
})