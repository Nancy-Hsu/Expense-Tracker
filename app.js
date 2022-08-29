const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
require('dotenv').config()
require('./config/mongoose')




app.use(router)




app.listen(port, () => {
  console.log(`express is listening on localhost:${port}`)
})