const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/new', (req, res) => {
  Category.find()
  .lean()
  .sort( '_id' )
    .then(categories => {
      
      res.render('new', { categories  })
    })
})


router.post('/', (req,res) => {
  const newRecord = req.body
  Record.create(newRecord)
  res.redirect('/')
})

module.exports = router
