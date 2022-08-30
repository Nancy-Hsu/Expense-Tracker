if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')

const CATEGORY = {
  家居: "https://fontawesome.com/icons/home?style=solid",
  交通: "https://fontawesome.com/icons/shuttle-van?style=solid",
  娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  飲食: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}

const category = Object.entries(CATEGORY).map(item =>
({
  name: item[0],
  icon: item[1]
}))

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  Category.create(category)
    .then(() => db.close())

  console.log('done')
})