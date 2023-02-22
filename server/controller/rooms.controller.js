const { rooms } = require('../data')

class RoomsController{
    // getRoomsList(req, res){
    //     const roomsList = {
    //         // data: [...rooms]
    //         data: rooms.map(r => {
    //             return {
    //                 id: r.id,
    //                 name: r.name,
    //                 maxPersons: r.maxPersons,
    //                 minPersons: r.minPersons,
    //                 roles: r.roles,
    //                 users: r.users,
    //                 status: r.status
    //             }
    //         })
    //     };
    //     // console.log(userData);
    //     res.json(roomsList)
    // }
}

module.exports = new RoomsController()