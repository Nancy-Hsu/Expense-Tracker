const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', async (req, res) => {
  const categories = await Category.find().lean().sort('_id')
  res.render('new', { categories })
})

router.post('/', async (req, res) => {
  const newRecord = req.body
  newRecord.userId = req.user._id
  await Record.create(newRecord)
  req.flash('success_msg', '已新增！')
  res.redirect('/')
})

router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  await Record.findOneAndDelete({ userId, _id })
  req.flash('success_msg', '已刪除！')
  res.redirect('/')
})

router.get('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  const categories = await Category.find().lean().sort('_id')
  const record = await Record.findOne({ userId, _id }).populate('categoryId').lean()
  const selectedOption = record.categoryId.name
  res.render('edit', { record, categories, selectedOption })

})


router.put('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const editedRecord = req.body

  await Record.findOneAndUpdate({ userId, _id }, editedRecord)

  req.flash('success_msg', '已更改！')
  res.redirect('/')

})

module.exports = router
