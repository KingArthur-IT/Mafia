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
            // INSERT INTO rooms (name, max_persons, min_persons, lover_max_count, reporter_max_count, barmen_max_count, doctor_max_count, bodyguard_max_count, terrorist_max_count)
// VALUES ('Название комнаты', 20, 5, 1, 1, 2, 1, 1, 2);

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