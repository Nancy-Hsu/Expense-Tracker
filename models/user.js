const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, require: true, trim: true },
  email: {
    type: String, require: true, unique: true, trim: true,
    unique: true },
  password: { type: String, require: true, trim: true},
  createAt: { type: Date, Default: Date.now },
  session: {
    type: String, require: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: String
  }
})

module.exports = mongoose.model('User', userSchema)
