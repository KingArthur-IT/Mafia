const { rooms } = require('../data')

class RoomsController{
    getRoomsList(req, res){
        const roomsList = {
            data: [...rooms]
        };
        // console.log(userData);
        res.json(roomsList)
    }
}

module.exports = new RoomsController()