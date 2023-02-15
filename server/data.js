const users = [
    {
        id: 1,
        nickname: 'Artem',
        gender: 'male',
        email: 'king@king.com',
        emailNotification: true,
        accountType: 'standart',
        rating: 101,
        achivements: ['sheriff', 'sheriff'],
        statistics: {}
    },
    {
        id: 2,
        nickname: 'Peter',
        gender: 'male',
        email: 'king2@king.com',
        emailNotification: true,
        accountType: 'vip',
        rating: 102,
        achivements: ['sheriff'],
        statistics: {}
    },
    {
        id: 3,
        nickname: 'Alex',
        gender: 'male',
        email: 'king3@king.com',
        emailNotification: true,
        accountType: 'vip',
        rating: 103,
        achivements: [],
        statistics: {}
    },
    {
        id: 4,
        nickname: 'Elena',
        gender: 'female',
        email: 'king4@king.com',
        emailNotification: true,
        accountType: 'vip',
        rating: 103,
        achivements: [],
        statistics: {}
    }
];

const rolesList = [
    'citizen',
    'doctor',
    'sheriff',
    'bodyguard',
    'lover',
    'reporter',
    'mafia',
    'barmen',
    'terrorist'
];

const rooms = [
    {
        id: 1,
        name: 'Test room',
        maxPersons: 3,
        minPersons: 2,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 1 },
            { role: 'barmen', count: 1 },
            { role: 'doctor', count: 1 },
            { role: 'bodyguard', count: 1 },
            { role: 'terrorist', count: 1 }
        ],
        users: [], //socketId, id, nickname, gender, role
        chat: [],
        status: 'collecting', //collecting, countdown, playing
        gameData: {
            gameStage: 0,
            timerID: null,
            timeCounter: 0,
            chatEnable: true,
            mafiaInChat: false,
            killsCandidates: []
        }
    },
    {
        id: 2,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 4,
        roles: [
            { role: 'lover', count: 0 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 0 },
            { role: 'doctor', count: 0 },
            { role: 'bodyguard', count: 0 },
            { role: 'terrorist', count: 0 }
        ],
        users: [],
        chat: [],
        status: 'collecting',
        gameData: {
            gameStage: 0,
            timerID: null,
            timeCounter: 0,
            chatEnable: true,
            mafiaInChat: false,
            killsCandidates: []
        }
    },
    {
        id: 3,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 1 },
            { role: 'barmen', count: 1 },
            { role: 'doctor', count: 1 },
            { role: 'bodyguard', count: 1 },
            { role: 'terrorist', count: 1 }
        ],
        users: [],
        chat: [],
        status: 'collecting',
        gameData: {
            gameStage: 0,
            timerID: null,
            timeCounter: 0,
            chatEnable: true,
            mafiaInChat: false,
            killsCandidates: []
        }
    }
]

/*
 currRoom.users.push({
    socketId: socket.id,
    id: currUser.id,
    nickname: currUser.nickname,
    gender: currUser.gender,
    role: 'unknown',
    isLive: true,
    labels: [] 
});
 */

module.exports = {
    users, rolesList, rooms
}