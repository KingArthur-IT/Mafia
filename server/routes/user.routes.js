const Router = require('express')
const userController = require('../controller/user.controller')
const router = new Router()

router.post('/user', userController.getUserInfo)
router.post('/user/achievs', userController.getAchievements)

module.exports = router