const user = {
    id: 1,
    nickname: 'KingArthur199',
    gender: 'male',
    email: 'king@king.com',
    emailNotification: true,
    accountType: 'standart',
    rating: 101,
    achivements: ['sheriff'],
    statistics: {}
};

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
        roomName: 'Моя крутая комната',
        currentPlayers: 1,
        min: 6,
        max: 10,
        roles: []
    }
]

// export {
//     user, rolesList, rooms
// }

module.exports = {
    user, rolesList, rooms
}