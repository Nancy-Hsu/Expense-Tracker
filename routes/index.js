const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const record = require('./modules/record')
const user = require('./modules/user')
const { authenticator } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const auth = require('./modules/auth')

router.use('/auth', auth)
router.use('/user', user)
router.use('/record', authenticator, record)
router.use('/', authenticator,home)
router.use('/', generalErrorHandler)


module.exports = router
