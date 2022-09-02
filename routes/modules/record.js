const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .sort('_id')
    .then(categories => {
      res.render('new', { categories })
    }).catch(err => res.render('error', { err }))
})

router.post('/', (req, res) => {
  const newRecord = req.body
  newRecord.userId = req.user._id
  Record.create(newRecord)
    .then(() => {
      req.flash('success_msg', '已新增！')
      res.redirect('/')
    })
    .catch(err => res.render('error', { err }))

})

router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Record.findOneAndDelete({ userId, _id })
    .then(() => {
      req.flash('success_msg', '已刪除！')
      res.redirect('/')
    })
    .catch(err => res.render('error', { err }))
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Category.find()
    .lean()
    .sort('_id')
    .then(categories => {
      Record.findOne({ userId, _id })
        .populate('categoryId')
        .lean()
        .then(record => {
          const selectedOption = record.categoryId.name
          res.render('edit', { record, categories, selectedOption })
        }).catch(err => res.render('error', { err }))
    }).catch(err => res.render('error', { err }))
})


router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const editedRecord = req.body
  Category.find()
    .lean()
    .then(() => {
      Record.findOneAndUpdate({ userId, _id }, editedRecord)
        .populate('categoryId')
        .lean()
        .sort('_id')
        .then(() => {
          req.flash('success_msg', '已更改！')
          res.redirect('/')
        }).catch(err => res.render('error', { err }))
    }).catch(err => res.render('error', { err }))
})

module.exports = router
