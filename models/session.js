// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const tokenSchema = new Schema({
//   token: {
//     type: String,
//     require: true
//   },
//   createdAt: {
//     type: Date,
//     defaultValue: Date.now,
//     expires: 3600,
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     index: true,
//     require: true
//   },
// })

// module.exports = mongoose.model('Token', tokenSchema)