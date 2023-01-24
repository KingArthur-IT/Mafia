
function getRolesCount(usersCount, roles) {
    const players = {
        mafia: 0,
        citizens: 0,
        barmen: 0,
        terrorist: 0,
        bodyguard: 0,
        reporter: 0,
        doctor: 0,
        lover: 0,
        sheriff: 0
    }

    players.mafia = Math.round(usersCount / 3)
    players.citizens = usersCount - players.mafia

    const playersMax = {
        barmen: players.mafia > 2 ? players.mafia < 7 ? 1 : 2 : 0,
        terrorist: players.mafia > 3 ? players.mafia < 7 ? 1 : 2 : 0,
        bodyguard: players.mafia > 3 ? players.mafia < 7 ? 1 : 2 : 0,
        reporter: players.citizens > 6 ? players.citizens < 12 ? 2 : 3 : 0, //1
        doctor: players.citizens > 5 ? players.citizens < 12 ? 2 : 3 : 0, //1
        lover: players.citizens > 7 ? 2 : 0, //1
        sheriff: players.citizens > 8 ? players.citizens < 12 ? 2 : 3 : 0 //1
    }

    //распределить игровые роли по кол-ву игроков и макс заданному клд-ву для каждой роли
    const arr = ['barmen', 'terrorist', 'bodyguard', 'reporter', 'doctor', 'lover', 'sheriff'] 
    arr.forEach(playerRole => {
        const roleCount = roles.find(r => r.role === playerRole)?.count

        if (roleCount)
            players[playerRole] = roleCount > playersMax[playerRole] ? playersMax[playerRole] : roleCount
    });
    
    //посчитать сумму всех игроков в игровых ролях кроме просто мирных
    const count = Object.entries(players).reduce((acc, val) => { 
        const v = val[0] === 'citizens' ? 0 : val[1] 
        acc += v
        return acc
    }, 0)
    players.citizens = usersCount - count

    const entries = Object.entries(players).filter((el) => el[1] > 0)

    return Object.fromEntries(entries)
}

module.exports = getRolesCount