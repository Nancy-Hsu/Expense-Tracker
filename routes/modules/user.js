const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')



router.get('/login', (req, res) => {
  res.render('login')
})


router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const registerData = req.body
  const errors = []
  if (password !== confirmPassword) {
    errors.push({ message: '請確認密碼與確認密碼需相符！' })
  }
  if (errors.length) {
    return res.render('register', { registerData, errors })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '使用者已存在！' })
        return res.render('register', { registerData, errors })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name, email, password: hash
          })
            .then(() => {
              req.flash('success_msg', '你已成功註冊，請再次登入。')
              res.redirect('login')
            })
            .catch(err => console.log(err))
        })
    }).catch(err => console.log(err))
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/user/login')
})







module.exports = router