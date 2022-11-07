const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  const categoryId = req.query.categoryId ? req.query : {}

  Category.find()
    .lean()
    .then(categories => {
      Record.find({ $and: [{ userId }, categoryId] })
        .populate('categoryId')
        .lean()
        .sort('-date')
        .then(records => {
          let totalAmount = records.reduce((total, record) => 
            total + record.amount, 0
          )
          const selectedOption = req.query.categoryId
          return res.render('index', { records, categories, totalAmount, selectedOption })
        }).catch(err => res.render('error', { err }))

    }).catch(err => res.render('error', { err }))
})



module.exports = router
