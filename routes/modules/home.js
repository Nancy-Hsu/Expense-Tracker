const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id

  let categoryId = req.query
  
  if (!req.query.categoryId || !req.query) {
     categoryId = {}
  }

  Category.find()
    .lean()
    .then(categories => {
      Record.find({ $and: [{ userId },  categoryId ]})
    .populate('categoryId')
    .lean()
    .sort('-id')
    .then(records => {
      let totalAmount = 0
      records.map(record => {
        totalAmount += record.amount
      })
      const selectedOption = req.query.categoryId 
      return res.render('index', { records, categories, totalAmount,  selectedOption })
    }).catch(err => console.log(err))
})
})



module.exports = router
