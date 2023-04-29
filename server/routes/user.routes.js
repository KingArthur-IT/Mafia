const Router = require('express')
const userController = require('../controller/user.controller')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

//user data
router.get('/user?:id', authMiddleware, userController.getUserInfo)
router.put('/user', userController.updateUserInfo)
router.put('/user/password', userController.updateUserPassword)
//notifications
router.post('/user/notifications', userController.getNotificationsData)
router.put('/user/notifications', userController.setAllNotificationsRead)
//rating
router.get('/user/rating?:id', authMiddleware, userController.getUserRating)

module.exports = router