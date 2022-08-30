if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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

  User.create(SEED_USER)
    .then(user => {
      const userId = user._id
      return Category.find()
        .lean()
        .then(categories => {
          return Promise.all(Array.from({ length: categories.length }, (_, i) => {
            return Record.create({
              name: categories[i].name,
              date: Date.now(),
              amount: (i+1) * 100,
              userId,
              categoryId: categories[i]._id
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

