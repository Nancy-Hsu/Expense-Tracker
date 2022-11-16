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

db.once('open', async () => {
  console.log('mongodb connected!')

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(SEED_USER.password, salt)
  const user = await User.create({ name: SEED_USER.name, email: SEED_USER.email, password: hash })
  const userId = user._id
  const categories = await Category.find().lean()

  const length = categories.length * 10
  await Promise.all(Array.from({ length }, async (_, i) => {
    await Record.create({
      name: categories[i % 5].name,
      date: Date.now(),
      amount: (i + 1) * 5,
      userId,
      categoryId: categories[i % 5]._id
    })
  }))
  console.log('done.')
  process.exit()
})

