const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Record = require('../../models/record')
const Category = require('../../models/category')
const { conditionLists } = require('../../helpers/filter-helpers')

router.get('/', (req, res) => {
  let sumByCategory = ""
  const userId = req.user._id
  const { year, month, categoryId } = req.query
  const optionsSelected = req.query
  const conditions = [
    { userId: ObjectId(userId) }
  ].concat(conditionLists(optionsSelected))
  

  Promise.all([Record.aggregate([{
    $match: { userId: ObjectId(userId) }
  },
  { $sort: { date: -1 } },
  {
    $group: {
      _id: null,
      years: { $addToSet: { $dateToString: { date: "$date", format: "%Y" } } },
      months: { $addToSet: { $dateToString: { date: "$date", format: "%m" } } },
    }
  },
  { $project: { __v: 0 } }
  ]), Category.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id"
        },
        name: 1,
        icon: 1
      }
    }])
  ])
    .then(([dateResult, categories]) => {
      console.log(dateResult)
      data = dateResult[0]
      data.categories = categories

      return Promise.all([Record.aggregate([
        { $match: { $and: conditions } },
        { $sort: { date: -1 } },
        { $project: { __v: 0 } }
      ]), Record.aggregate([
        { $match: { $and: conditions } },
        { $sort: { date: -1 } },
        { $group: { _id: { $toString: '$categoryId' }, sum: { $sum: { '$toInt': "$amount" } } } },
        { $project: { __v: 0 } }
      ])])
    })
    .then(([result, sumCategory]) => {
      console.log(sumCategory)
      sumByCategory = sumCategory
      return Record.populate(result, { path: "categoryId", options: { lean: true } })
    })
    .then( records => {

      let totalAmount = records.reduce((total, record) =>
        total + record.amount, 0
      )
      return res.render('index', {
        records,
        totalAmount,
        optionsSelected,
        data,
        sumByCategory
      })
    })
    .catch(err => res.render('error', { err }))
})



module.exports = router
