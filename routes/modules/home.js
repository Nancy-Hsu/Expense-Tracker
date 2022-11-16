const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Record = require('../../models/record')
const Category = require('../../models/category')
const { conditionLists } = require('../../helpers/filter-helpers')

router.get('/', async (req, res) => {
  const userId = req.user._id
  const optionsSelected = req.query
  const conditions = [
    { userId: ObjectId(userId) },
  ].concat(conditionLists(optionsSelected))

  const [dateResult, categories] = await Promise.all([Record.aggregate([{
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

  data = dateResult[0] || {}
  data.categories = categories
  const [records, sumByCategory, totalAmount] = await Promise.all([
    Record.aggregate([
      { $match: { $and: conditions } },
      { $sort: { date: -1 } },
      {
        $project: {
          _v: 0
        }
      }
    ]),
    Record.aggregate([
      { $match: { $and: conditions } },
      {
        $group: {
          _id: { $toString: '$categoryId' },
          sum: { $sum: { '$toInt': "$amount" } },
        }
      }
    ]),
    Record.aggregate([
      { $match: { $and: conditions } },
      {
        $group: {
          _id: null,
          sum: { $sum: { '$toInt': "$amount" } },
        }
      }
    ])
  ])

  await Record.populate(records, { path: "categoryId", options: { lean: true } })

  return res.render('index', {
    records,
    totalAmount: totalAmount[0]?.sum || 0,
    optionsSelected,
    data,
    sumByCategory
  })

})



module.exports = router
