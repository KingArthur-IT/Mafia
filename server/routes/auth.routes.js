const Router = require('express')
const authController = require('../controller/auth.controller')
const router = new Router()
const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/auth/registration', [
    check('nickname', 'Nickname cannot be empty').notEmpty(),
    check('email', 'Email cannot be empty').notEmpty(),
    check('password', 'Password is invalid').isLength({ min: 8, max: 32 }),
], authController.registration)

router.post('/auth/login', authController.login)

module.exports = router