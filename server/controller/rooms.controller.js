const uuid = require('uuid')
const { rooms } = require('../data')

class RoomsController{
    createRoom(req, res){
        const data = req.body
        if (data?.name && data?.maxPersons && data?.minPersons && data?.roles.length) {
            const newId = uuid.v4()
            rooms.push({
                id: newId,
                name: data.name,
                maxPersons: data.maxPersons,
                minPersons: data.minPersons,
                roles: [...data.roles],
                users: [],
                chat: [],
                status: 'collecting',
                gameData: {
                    gameStage: 0,
                    timerID: null,
                    timeCounter: 0,
                    chatEnable: true,
                    mafiaInChat: false,
                    killsCandidates: [],
                    votedUsers: [],
                    winnerTeam: ''
                }
            });

            res.json({
                status: 'ok',
                message: 'Room created successfully',
                data: { id: newId }
            })
        } else {
            res.json({
                status: 'error',
                message: 'Invalid request',
                data: null
            })
        }
    }
}

module.exports = new RoomsController()