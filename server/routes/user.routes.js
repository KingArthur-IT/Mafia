const Router = require('express')
const userController = require('../controller/user.controller')
const router = new Router()

router.get('/user', userController.getUserInfo)

module.exports = router