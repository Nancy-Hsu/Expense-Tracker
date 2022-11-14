const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const crypto = require("crypto");
const passport = require('passport')
const bcrypt = require('bcryptjs')
const useNodemailer = require('../../helpers/sendEmail')

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
    .lean()
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
            .catch(err => res.render('error', { err }))
        })
    }).catch(err => res.render('error', { err }))
})
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/user/login',
  failureFlash: true,
  successRedirect: '/'
}))

//認證信頁面
router.get('/resetPassword', (req, res) => {
  res.render('requestResetPassword')
})
//發送認證信
router.post('/resetPassword', (req, res) => {
  const { email } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error_msg', 'User is not exit')
        return res.redirect('/user/resetPassword')
      }
      let token = crypto.randomBytes(32).toString("hex")
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      return user.save()
        .then(user => {
          //設定 email 相關資料
          const { host }= req.headers
          const resetEmail = {
            name: user.name,
            email: user.email,
            subject: 'Expense-tracker Password Reset',
            mailFile: './views/partials/resetPasswordMail.hbs',
            host,
            token
          }
          //發送email
          return useNodemailer(resetEmail)
            .then(() => {
              req.flash('success_msg', `The e-mail has been sent to your email`);
              res.redirect('/user/resetPassword');
            })
            .catch(err => res.render('error', { err }))
        })
    })

})
//重設密碼頁面
router.get('/resetPassword/:token', (req, res) => {
  const { token }= req.params
  return User.findOne({ resetPasswordToken: token }
  )
    .then(user => {
      if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.')
        return res.redirect('/user/resetPassword')
      }
      if (!user.resetPasswordExpires > Date.now() ||
        !crypto.timingSafeEqual(Buffer.from(user.resetPasswordToken), Buffer.from(token))) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.')
        return res.redirect('/user/resetPassword')
      }
      res.render('resetPassword', { token })
    })

})
//重設密碼
router.post('/resetPassword/:token', (req, res) => {
  const token = req.params.token
  const { password, confirmPassword } = req.body
 
  if (password !== confirmPassword) {
    req.flash('error_msg', '請確認密碼與確認密碼需相符！')
    return res.redirect(`/user/resetPassword/${ token }`)
  }

  return User.findOne({ resetPasswordToken: token }
  )
    .then(user => {
      if (!user || !user.resetPasswordExpires > Date.now() || !crypto.timingSafeEqual(Buffer.from(user.resetPasswordToken), Buffer.from(token))) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.')
        return res.redirect('/user/resetPassword')
      }
      return bcrypt.hash(password, 10)
      .then(hash => {
        user.password = hash
        user.resetPasswordToken = null 
        user.resetPasswordExpires = null
        user.save()
        req.flash('success_msg', 'Password changed successfully')
        return res.redirect('/user/login')
      })
    })
})


router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/user/login')
})







module.exports = router