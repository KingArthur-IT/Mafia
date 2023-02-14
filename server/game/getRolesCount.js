
function getRolesCount(usersCount, roles) {
    const players = {
        mafia: 0,
        citizen: 0,
        barmen: 0,
        terrorist: 0,
        bodyguard: 0,
        reporter: 0,
        doctor: 0,
        lover: 0,
        sheriff: 0
    }

    players.mafia = Math.round(usersCount / 3)
    players.citizen = usersCount - players.mafia

    const playersMax = {
        barmen: players.mafia > 2 ? players.mafia < 7 ? 1 : 2 : 0,
        terrorist: players.mafia > 3 ? players.mafia < 7 ? 1 : 2 : 0,
        bodyguard: players.mafia > 3 ? players.mafia < 7 ? 1 : 2 : 0,
        reporter: players.citizen > 8 ? players.citizen < 12 ? 2 : 3 : 0, //1 
        doctor: players.citizen > 5 ? players.citizen < 12 ? 2 : 3 : 0, //1
        lover: players.citizen > 7 ? 2 : 1, //1
        sheriff: players.citizen > 6 ? players.citizen < 12 ? 2 : 3 : 0 //1
    }

    //распределить игровые роли по кол-ву игроков и макс заданному клд-ву для каждой роли
    const arr = ['barmen', 'terrorist', 'bodyguard', 'reporter', 'doctor', 'lover'] 
    arr.forEach(playerRole => {
        const roleCount = roles.find(r => r.role === playerRole)?.count

        if (roleCount)
            players[playerRole] = roleCount > playersMax[playerRole] ? playersMax[playerRole] : roleCount
    });

    players['sheriff'] = playersMax['sheriff']
    
    //посчитать сумму всех игроков в игровых ролях кроме просто мирных
    const count = Object.entries(players).reduce((acc, val) => { 
        const v = val[0] === 'citizen' ? 0 : val[1] 
        acc += v
        return acc
    }, 0)
    players.citizen = usersCount - count

    const entries = Object.entries(players).filter((el) => el[1] > 0)

    return Object.fromEntries(entries)
}

module.exports = getRolesCount