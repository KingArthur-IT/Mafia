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
        email: 'king@king.com',
        emailNotification: true,
        accountType: 'standart',
        rating: 101,
        achivements: ['sheriff'],
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
        chat: []
    },
    {
        id: 2,
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
        chat: []
    }
]

// export {
//     user, rolesList, rooms
// }

module.exports = {
    user, rolesList, rooms
}