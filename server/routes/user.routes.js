const Router = require('express')
const userController = require('../controller/user.controller')
const router = new Router()

router.get('/user', userController.getUserInfo)
router.get('/user/achievs', userController.getAchievements)

module.exports = router