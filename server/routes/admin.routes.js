const Router = require('express')
const adminController = require('../controller/admin.controller')
const router = new Router()

router.post('/admin/setNewRole', adminController.setNewRole)

module.exports = router