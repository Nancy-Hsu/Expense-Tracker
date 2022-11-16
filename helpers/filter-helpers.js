const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const conditionLists = data => {
  const { year, month, categoryId } = data
  const conditions = []
  if (year) {
    conditions.push({ "$expr": { "$eq": [{ $toString: { $year: '$date' } }, year] } })
  }
  if (month) {
    conditions.push({ "$expr": { "$eq": [{ $toString: { $month: '$date' } }, month] } })
  }
  if (categoryId) {
    // conditions.push({ categoryId  })
    conditions.push({ "$expr": { "$eq": [{ $toString: "$categoryId" }, { $toString: categoryId }] } })
  }
  return conditions
}

module.exports = {
  conditionLists
}