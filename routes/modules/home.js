const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  Category.find()
    .lean()
    .then(categories => {
      Record.find()
        .populate('categoryId')
        .lean()
        // .sort({ id })
        .then(records => {
          let totalAmount = 0
          records.map(record => {
            totalAmount += record.amount
          })

          res.render('index', { records, categories, totalAmount })
        }).catch(err => console.log(err))
    })
})

module.exports = router
