const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
name: {
  type: String,
  require: true
},
icon: {
  type: String,
}
})

module.exports = mongoose.model('Category', categorySchema)