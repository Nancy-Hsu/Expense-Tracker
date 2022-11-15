const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Record = require('../../models/record')
const Category = require('../../models/category')
const { conditionLists } = require('../../helpers/filter-helpers')

router.get('/', (req, res) => {
  let sumByCategory = ""
  let totalAmount = 0
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
      data = dateResult[0]
      data.categories = categories

      return Record.aggregate ([
        { $match: { $and: conditions } },
        { $sort: { date: -1 } },
        { $group: { 
          _id: { $toString: '$categoryId' }, 
          sum: { $sum: { '$toInt': "$amount" } },
          data: { $push: { _id: "$_id", name: "$name", date: "$date", amount: "$amount", categoryId: "$categoryId" }}  
        } },
      ])
    })
    .then((results) => {
      totalAmount = results.reduce((total, result) =>
        total + result.sum, 0
      )
      sumByCategory = results
      
      let records = []
      results.forEach(r => {
        records = records.concat(r.data)
        delete r.data
      })
      return Record.populate(records, { path: "categoryId", options: { lean: true } })
    })
    .then( records => {

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
