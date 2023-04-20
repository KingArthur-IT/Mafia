const Router = require('express')
const userController = require('../controller/user.controller')
const router = new Router()

//user data
router.post('/user', userController.getUserInfo)
router.put('/user', userController.updateUserInfo)
router.put('/user/password', userController.updateUserPassword)
//notifications
router.post('/user/notifications', userController.getNotificationsData)
router.put('/user/notifications', userController.setAllNotificationsRead)
//statistic
router.post('/user/stats', userController.getStatsData)
router.post('/user/additions', userController.getAdditionsData)
//rating
router.post('/user/rating', userController.getUserRating)

module.exports = router