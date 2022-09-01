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
    })
})

router.post('/', (req, res) => {
  const newRecord = req.body
  newRecord.userId = req.user._id
  Record.create(newRecord)
  res.redirect('/')
})

router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id 
  Record.findOneAndDelete({ userId, _id })
    .then(() => res.redirect('/'))
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
        
          res.render('edit', { record, categories })
        })
    })
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
        .then(() => res.redirect('/'))
    }).catch(err => console.log(err))
})

module.exports = router
