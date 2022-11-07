if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')

const SEED_USER = {
  name: 'Nancy',
  email: 'user1@example.com',
  password: '12345678'
}

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({ name: SEED_USER.name, email: SEED_USER.email, password: hash }))
    .then(user => {
      const userId = user._id
      return Category.find()
        .lean()
        .then(categories => {
          const length = categories.length * 10 
          return Promise.all(Array.from({ length }, (_, i) => {
            return Record.create({
              name: categories[i % 5].name,
              date: Date.now(),
              amount: (i + 1) * 5,
              userId,
              categoryId: categories[i % 5]._id
            })
          })
          )
        })
        .then(() => {
          console.log('done.')
          process.exit()
        })
    })
})
