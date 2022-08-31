const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})


router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const  registerDate = req.body
  User.findOne({ email  })
  .then(user => {
    if (user) {
      return res.render('register', { name, email, password, confirmPassword })
      }
      return User.create({
        name, email, password
      })
      .then(() => {
        // swal('註冊成功!')
        res.redirect('login')})
        .catch(err => console.log(err))
  }).catch(err => console.log(err))
})






module.exports = router