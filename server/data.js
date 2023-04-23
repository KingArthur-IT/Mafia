const users = [
    {
        id: 1,
        nickname: 'Artem',
        role: 'owner', //admin user
        gender: 'male',
        age: '22',
        country: 'USA',
        email: 'king@king.com',
        password: 'Qwerty12',
        emailNotification: true,
        accountType: 'standart', //premium
        rating: 201,
        statistics: {
            allGames: { count: 1, score: 1 },
            mafiaWins: { count: 0, score: 0 },
            citizenWins: { count: 0, score: 0 },
            wasMafia: { count: 0, score: 0 },
            wasSheriff: { count: 10, score: 10 },
            wasDoctor: { count: 0, score: 0 },
            wasLover: { count: 0, score: 0 },
            wasTerrorist: { count: 0, score: 0 },
            wasBarmen: { count: 0, score: 0 },
            wasBodyguard: { count: 0, score: 0 },
        },
        userAdditions: {
            friends: { count: 1, score: 50 },
        },
        notifications: [
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '20.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: false
            }
        ]
    },
    {
        id: 2,
        nickname: 'Peter',
        gender: 'male',
        age: '22',
        country: 'USA',
        email: 'king2@king.com',
        password: 'Qwerty1',
        emailNotification: true,
        accountType: 'premium',
        rating: 102,
        statistics: {
            allGames: { count: 0, score: 0 },
            mafiaWins: { count: 0, score: 0 },
            citizenWins: { count: 0, score: 0 },
            wasMafia: { count: 0, score: 0 },
            wasSheriff: { count: 0, score: 0 },
            wasDoctor: { count: 0, score: 0 },
            wasLover: { count: 0, score: 0 },
            wasTerrorist: { count: 0, score: 0 },
            wasBarmen: { count: 0, score: 0 },
            wasBodyguard: { count: 0, score: 0 },
        },
        userAdditions: {
            friends: { count: 0, score: 0 },
        },
        notifications: [
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '20.03.2023',
                isRead: false
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            }
        ]
    },
    {
        id: 3,
        nickname: 'Alex',
        gender: 'male',
        age: '22',
        country: 'USA',
        email: 'king3@king.com',
        password: 'Qwerty1',
        emailNotification: true,
        accountType: 'premium',
        rating: 103,
        statistics: {
            allGames: { count: 0, score: 0 },
            mafiaWins: { count: 0, score: 0 },
            citizenWins: { count: 0, score: 0 },
            wasMafia: { count: 0, score: 0 },
            wasSheriff: { count: 0, score: 0 },
            wasDoctor: { count: 0, score: 0 },
            wasLover: { count: 0, score: 0 },
            wasTerrorist: { count: 0, score: 0 },
            wasBarmen: { count: 0, score: 0 },
            wasBodyguard: { count: 0, score: 0 },
        },
        userAdditions: {
            friends: { count: 0, score: 0 },
        },
        notifications: [
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '20.03.2023',
                isRead: false
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            }
        ]
    },
    {
        id: 4,
        nickname: 'Elena',
        gender: 'female',
        age: '22',
        country: 'USA',
        email: 'king4@king.com',
        password: 'Qwerty1',
        emailNotification: true,
        accountType: 'premium',
        rating: 103,
        statistics: {
            allGames: { count: 0, score: 0 },
            mafiaWins: { count: 0, score: 0 },
            citizenWins: { count: 0, score: 0 },
            wasMafia: { count: 0, score: 0 },
            wasSheriff: { count: 0, score: 0 },
            wasDoctor: { count: 0, score: 0 },
            wasLover: { count: 0, score: 0 },
            wasTerrorist: { count: 0, score: 0 },
            wasBarmen: { count: 0, score: 0 },
            wasBodyguard: { count: 0, score: 0 },
        },
        userAdditions: {
            friends: { count: 0, score: 0 },
        },
        notifications: [
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '20.03.2023',
                isRead: false
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            },
            {
                title: 'Очень важное уведомление',
                msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
                date: '21.03.2023',
                isRead: true
            }
        ]
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

const gameHallId = 31415926535;

const rooms = [
    {
        id: 1,
        name: 'Test room 1',
        maxPersons: 4,
        minPersons: 4,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 1 },
            { role: 'barmen', count: 1 },
            { role: 'doctor', count: 1 },
            { role: 'bodyguard', count: 1 },
            { role: 'terrorist', count: 1 }
        ],
        users: [], //socketId, id, nickname, gender, role, isActionSend, labels, isLive
        chat: [],
        status: 'collecting', //collecting, countdown, playing
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
    },
    {
        id: 2,
        name: 'Test room 2',
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
        }
    },
    {
        id: 3,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 1 },
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
        }
    },
    {
        id: 4,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 1 },
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
        }
    },
    {
        id: 5,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 1 },
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
        }
    },
    {
        id: 6,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 1 },
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
        }
    },
    {
        id: 7,
        name: 'Test room',
        maxPersons: 10,
        minPersons: 8,
        roles: [
            { role: 'lover', count: 1 },
            { role: 'reporter', count: 0 },
            { role: 'barmen', count: 1 },
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
            killsCandidates: [],
            votedUsers: [],
            winnerTeam: ''
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
    labels: [],
    isActionSend: false
});
 */

module.exports = {
    users, rolesList, rooms, gameHallId
}