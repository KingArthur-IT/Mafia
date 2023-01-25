const users = [
    {
        id: 1,
        nickname: 'KingArthur199',
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
        nickname: 'KingArthur123',
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
        nickname: 'King123',
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
        nickname: 'King',
        gender: 'male',
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
            {role: 'lover', count: 1},
            {role: 'reporter', count: 1},
            {role: 'barmen', count: 1},
            {role: 'doctor', count: 1},
            {role: 'bodyguard', count: 1},
            {role: 'terrorist', count: 1}
        ],
        users: [], //socketId, id, nickname, gender, role
        chat: [],
        status: 'collecting' //collecting, countdown, playing
    },
    {
        id: 2,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 4,
        roles: [
            {role: 'lover', count: 0},
            {role: 'reporter', count: 0},
            {role: 'barmen', count: 0},
            {role: 'doctor', count: 0},
            {role: 'bodyguard', count: 0},
            {role: 'terrorist', count: 0}
        ],
        users: [],
        chat: [],
        status: 'collecting'
    },
    {
        id: 3,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            {role: 'lover', count: 1},
            {role: 'reporter', count: 1},
            {role: 'barmen', count: 1},
            {role: 'doctor', count: 1},
            {role: 'bodyguard', count: 1},
            {role: 'terrorist', count: 1}
        ],
        users: [],
        chat: [],
        status: 'collecting'
    }
]

// export {
//     user, rolesList, rooms
// }

module.exports = {
    users, rolesList, rooms
}