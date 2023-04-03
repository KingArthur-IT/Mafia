const Router = require('express')
const roomsController = require('../controller/rooms.controller')
const router = new Router()

router.post('/rooms/create', roomsController.createRoom)

module.exports = router