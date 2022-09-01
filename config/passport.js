const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
   // 設定本地登入策略
   passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
     User.findOne({ email})
     .then( user => {
      if(!user) return done(null, false, { message: '使用者不存在'})
      if (user.password !== password) {
        return done(null, false, { message: '密碼不正確' })
      }
      return done(null, user)
     }).catch(err => done(err, false))
   }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => done(null, user))
    .catch (err => done(err, null))
  })
}