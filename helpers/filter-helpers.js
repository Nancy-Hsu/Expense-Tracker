const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const conditionLists = (data, condition) => {
  const { year, month, categoryId } = data
  const conditions = [
    // { userId: ObjectId(userId) }
  ]
  if (year) {
    conditions.push({ "$expr": { "$eq": [{ $toString: { $year: '$date' } }, year] } })
  }
  if (month) {
    conditions.push({ "$expr": { "$eq": [{ $toString: { $month: '$date' } }, month] } })
  }
  if (categoryId) {
    conditions.push({ "$expr": { "$eq": [{ $toString: "$categoryId" }, categoryId] } })
  }
  return conditions
}

module.exports = {
  conditionLists
}