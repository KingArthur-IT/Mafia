const Router = require('express')
const adminController = require('../controller/admin.controller')
const router = new Router()

router.post('/admin/setNewRole', adminController.setNewRole)
router.post('/admin/sendEntryNotification', adminController.addEntryNotification)

module.exports = router