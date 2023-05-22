const pool = require('../config/db.config')
const getRolesCount = require('../game/getRolesCount')
const { shuffle } = require('../use/helpers')
const { rooms, users } = require('../data')

const GAME_HALL_ID = 31415926535
const STEPS_TIMER_COUNT = 20; //60 sec

const getRoomsList = async () => {
  const list = await pool.query(`
    SELECT id, name, max_persons, min_persons, lover_max_count, reporter_max_count, barmen_max_count, doctor_max_count, bodyguard_max_count, terrorist_max_count, users, status 
    FROM rooms GROUP BY id;
  `)

  const mappedList = list.rows.map( room => {
      return {
        id: room.id,
        name: room.name,
        max_persons: room.max_persons,
        min_persons: room.min_persons,
        roles: [
          { role: 'lover', count: room.lover_max_count },
          { role: 'reporter', count: room.reporter_max_count },
          { role: 'barmen', count: room.barmen_max_count },
          { role: 'doctor', count: room.doctor_max_count },
          { role: 'bodyguard', count: room.bodyguard_max_count },
          { role: 'terrorist', count: room.terrorist_max_count }
        ],
        users_count: room.users.length,
        status: room.status
      }
    }
  )
  return mappedList
}

const getTableData = async (table, id) => {
  const data = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id])
  return data.rows[0]
}

const getFieldValue = async (table, tableId, field) => {
  const data = await pool.query(`SELECT ${field} FROM ${table} WHERE id = $1`, [tableId])
  return data.rows[0][field]
}

const updateFieldInDB = async (table, id, field, value) => {
  await pool.query(`UPDATE ${table} SET ${field} = $1 WHERE id = $2;`, [value, id])
}

// Main function
function mySocket(socket) {

  // await updateFieldInDB('rooms', currRoom.id, 'status', 'collecting')
  // await updateFieldInDB('rooms', currRoom.id, 'game_is_timer_active', false)
  // const clearTimer = async (roomId) => {
  //   this.in(roomId).emit('setCountdown', 0);
  //   const timerID = await pool.query('SELECT game_timer_id FROM rooms WHERE id = $1;', [roomId])
  //   // clearInterval(rooms.find(r => r.id === roomId).gameData.timerID)
  //   clearInterval(timerID.rows[0].game_timer_id)
  //   await pool.query('UPDATE rooms SET game_timer_id = $1 WHERE id = $2;', [-1, roomId])
  //   await pool.query('UPDATE rooms SET game_timer_counter = $1 WHERE id = $2;', [0, roomId])
  //   // rooms.find(r => r.id === roomId).gameData.timerID = null
  //   // rooms.find(r => r.id === roomId).gameData.timeCounter = 0
  // }
  
  const sendChatMsg = async (roomId, author, text, isHidden) => {
    await pool.query('UPDATE rooms SET chat = chat || $1 WHERE id = $2;', [{ author, text, isHidden }, roomId])

    if (!isHidden)
        this.in(roomId).emit('newChatMsg', { author, text, isHidden });  
    else {
      const users = await getFieldValue('rooms', roomId, 'users')

      users.forEach(user => this.to(user.socketId).emit("newChatMsg", { author, text, isHidden }))
    }
  }

  const sendGameDataToRoom = async (roomId, title, isChatEnable, isMaffiaInChat) => {
    this.in(roomId).emit('updateGameTitle', title);
    this.in(roomId).emit('chatEnable', isChatEnable);

    await updateFieldInDB('rooms', roomId, 'game_chat_enable', isChatEnable)
    await updateFieldInDB('rooms', roomId, 'game_mafia_in_chat', isMaffiaInChat)
    
    const timerCounter = await getFieldValue('rooms', roomId, 'game_timer_counter')
    this.in(roomId).emit('setCountdown', timerCounter);
  }

  const setGameStage = async (roomId, stage) => {
    await updateFieldInDB('rooms', roomId, 'game_stage', stage)
    this.in(roomId).emit('setGameStage', stage);
  }

  const returnDataToFallenUser = (userId, roomId) => {
    const currRoom = rooms.find(room => room.id === roomId)

    const isPlayerMafia = currRoom.users.find(usr => usr.id === userId).role === 'mafia'
    const isPlayerSheriff = currRoom.users.find(usr => usr.id === userId).role === 'sheriff'

    //chat
    if (isPlayerMafia)
      socket.emit('copyChat', currRoom.chat)
    else socket.emit('copyChat', currRoom.chat.filter((msg) => !msg.isHidden))

    //роли игроков
    socket.emit("updateUsers", currRoom.users.map(({ socketId, id, nickname, gender, role, isLive, labels, isActionSend }) =>
      ({ socketId, id, nickname, gender, isLive, labels, isActionSend,
        role: !isLive || isPlayerMafia && (role === 'mafia' || role === 'terrorist') || isPlayerSheriff && labels.includes('sheriff') ? role : 'unknown' })
    ))

    //game info
    socket.emit('setGameStage', currRoom.gameData.gameStage);
    socket.emit('setCountdown', currRoom.gameData.timeCounter);
    socket.emit('setMafiaPlayersCount', rooms.find(room => room.id === roomId).users.filter(user => user.isLive && ['mafia', 'barmen', 'terrorist'].includes(user.role)).length);
    socket.emit('updateVoicesCount', {});

    if (currRoom.gameData.gameStage === 1) {
      socket.emit('updateGameTitle', 'Ночь. Мафия в чате');
      socket.emit('chatEnable', true);
    }
    if (currRoom.gameData.gameStage === 2) {
      socket.emit('updateGameTitle', 'Мафия выбирает жертву');
      socket.emit('chatEnable', false);
      const candidatesWithVoiceCount = currRoom.gameData.killsCandidates.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      }, {});
      socket.emit('updateVoicesCount', candidatesWithVoiceCount);
    }
    if (currRoom.gameData.gameStage === 3) {
      socket.emit('updateGameTitle', 'День. Общее обсуждение'); 
      socket.emit('chatEnable', true);
    }
    if (currRoom.gameData.gameStage === 4) {
      socket.emit('updateGameTitle', 'День. Голосование');
      socket.emit('chatEnable', false);
      const candidatesWithVoiceCount = currRoom.gameData.killsCandidates.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      }, {});
      socket.emit('updateVoicesCount', candidatesWithVoiceCount);
    }

    //player info
    socket.emit("setPlayerRole", currRoom.users.find(usr => usr.id === userId).role)
    socket.emit('wasKilled', !currRoom.users.find(usr => usr.id === userId).isLive)
    socket.emit('setLabels', currRoom.users.find(usr => usr.id === userId).labels)
    socket.emit('setActionSend', currRoom.users.find(usr => usr.id === userId).isActionSend) 
  }

  //--------------------------------------------------------------------------------

  const distributeRoles = async (currRoom) => {
    const maxSetedRoles = [
      { role: 'lover', count: currRoom.lover_max_count },
      { role: 'reporter', count: currRoom.reporter_max_count },
      { role: 'barmen', count: currRoom.barmen_max_count },
      { role: 'doctor', count: currRoom.doctor_max_count },
      { role: 'bodyguard', count: currRoom.bodyguard_max_count },
      { role: 'terrorist', count: currRoom.terrorist_max_count }
    ]
    const roles = getRolesCount(currRoom.users.length, maxSetedRoles)
    const rolesEntries = Object.entries(roles)

    //распределить роли
    const users = currRoom.users
    users.forEach((user) => {
        if (rolesEntries.length) {
            const rand = Math.round( Math.random() * (rolesEntries.length - 1) )
            user.role = rolesEntries[rand][0]

            if (rolesEntries[rand][1] > 1)
                rolesEntries[rand][1] = rolesEntries[rand][0] - 1
            else rolesEntries.splice(rand, 1)
        }
        else user.role = 'citizen'

        this.to(user.socketId).emit("setPlayerRole", user.role)
    })
    await updateFieldInDB('rooms', currRoom.id, 'users', JSON.stringify(users))

    //мафия видит мафию
    users.filter((user) => user.role === 'mafia').forEach( user =>
      this.to(user.socketId).emit("updateUsers", users.map( ({ socketId, id, nickname, gender, role, isLive, labels, isActionSend }) => 
        ({ socketId, id, nickname, gender, role: role !== 'mafia' && role !== 'terrorist' ? 'unknown' : role, isLive, labels, isActionSend })
      ))
    )
  }

  const killPlayer = (roomId, isMafiaKilling = false) => {
    const currRoom = rooms.find(room => room.id === roomId)

    //doctor healing
    if (isMafiaKilling) {
      currRoom.gameData.killsCandidates = currRoom.gameData.killsCandidates.filter(cand => 
        !currRoom.users.find(usr => usr.id === cand).labels.includes('doctor'))      
    }

    if (currRoom.gameData.killsCandidates.length) {
      //count voices
      const candidatesWithVoiceCount = currRoom.gameData.killsCandidates.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      }, {});

      const maxVals = Math.max(...Object.values(candidatesWithVoiceCount)); //max voices for candidate
      const candidates = Object.keys(candidatesWithVoiceCount).filter(key => candidatesWithVoiceCount[key] === maxVals); //ids of candidates for killing

      let killIndex = 0

      if (candidates.length > 1) 
        killIndex = Math.round(Math.random() * (candidates.length - 1))

      const killId = Number(candidates[killIndex])

      currRoom.users.find((user) => user.id === killId).isLive = false
      this.in(roomId).emit('updateUserData', currRoom.users.find((user) => user.id === killId));
      this.to(currRoom.users.find((user) => user.id === killId).socketId).emit('wasKilled', true)

      if (currRoom.users.find((user) => user.id === killId).role === 'bodyguard')
        removeBodyguardLabel(roomId)

      sendChatMsg(roomId, 'server', `Игрок ${currRoom.users.find((user) => user.id === killId).nickname} был убит`, false) 
    } else {
      sendChatMsg(roomId, 'server', `Все остались живы`, false) 
    }
    currRoom.gameData.killsCandidates = []
  }

  const killInstantly = (roomId, userId) => {
    const currUser = rooms.find(room => room.id === roomId).users.find((user) => user.id === userId)
    currUser.isLive = false
    this.in(roomId).emit('updateUserData', currUser);
    this.to(currUser.socketId).emit('wasKilled', true);
  }

  //--------------------------------------------------------------------------------

  const clearLabelsList = async (roomId) => {
    const currRoom = await getTableData('rooms', roomId)

    const users = currRoom.users
    users.forEach((user) => {
      user.labels = user.labels.filter(lbl => lbl === 'sheriff' || lbl === 'reporter' || lbl === 'bodyguard');
      this.to(user.socketId).emit('setLabels', user.labels)
    })

    await updateFieldInDB('rooms', roomId, 'users', JSON.stringify(users))
  }

  const setLabel = async (roomId, actionUserId, labelName) => {
    const users = await getFieldValue('rooms', roomId, 'users')
    const selectedUser = users.find((user) => user.id === actionUserId)
    selectedUser.labels.push(labelName)

    await updateFieldInDB('rooms', roomId, 'users', JSON.stringify(users))

    this.to(selectedUser.socketId).emit('setLabel', labelName);
  }

  const removeBodyguardLabel = async (roomId) => {
    const currRoom = await getTableData('rooms', roomId)

    currRoom.users.forEach((user) => {
      user.labels = user.labels.filter(lbl => lbl !== 'bodyguard');
      this.to(user.socketId).emit('setLabels', user.labels)
    })

    await updateFieldInDB('rooms', roomId, 'users', JSON.stringify(currRoom.users))
  }

  //--------------------------------------------------------------------------------

  const clearActionSend = async (roomId) => {
    const currRoom = await getTableData('rooms', roomId)

    currRoom.users.forEach((user) => {
      user.isActionSend = false
      this.to(user.socketId).emit('setActionSend', false)
    })

    await updateFieldInDB('rooms', roomId, 'users', JSON.stringify(currRoom.users))
  }

  const updateActionSend = async (roomId, userId, val) => {
    const currRoom = await getTableData('rooms', roomId)
    
    const users = currRoom.users
    const user = users.find((user) => user.id === userId)
    user.isActionSend = val
    await updateFieldInDB('rooms', roomId, 'users', JSON.stringify(users))

    this.to(user.socketId).emit('setActionSend', val);
  }

  //--------------------------------------------------------------------------------

  const openNewGameStep = async (roomId) => {
    const gameStage = await getFieldValue('rooms', roomId, 'game_stage')
    await updateFieldInDB('rooms', roomId, 'game_timer_counter', STEPS_TIMER_COUNT)
    await clearActionSend(roomId)

    const currRoom = await getTableData('rooms', roomId)
    this.in(roomId).emit('updateVoicesCount', {});
    this.in(roomId).emit('setMafiaPlayersCount', currRoom.users.filter(user => user.isLive && ['mafia', 'barmen', 'terrorist'].includes(user.role)).length);

    if (gameStage === 1) {
      await sendGameDataToRoom(roomId, 'Ночь. Мафия в чате', true, true)
      await clearLabelsList(roomId)
    }
    if (gameStage === 2) {
      await updateFieldInDB('rooms', roomId, game_voted_users, '[]')
      await sendGameDataToRoom(roomId, 'Мафия выбирает жертву', false, false)
    }
    if (gameStage === 3) {
      await sendGameDataToRoom(roomId, 'День. Общее обсуждение', true, false)
      await removeBodyguardLabel(roomId)
    }
    if (gameStage === 4) {
      await updateFieldInDB('rooms', roomId, game_voted_users, '[]')
      await sendGameDataToRoom(roomId, 'День. Голосование', false, false)
    }
  }

  //--------------------------------------------------------------------------------

  const startGame = async (data) => {
    const currRoom = await getTableData('rooms', data.roomId)

    await updateFieldInDB('rooms', data.roomId, 'status', 'playing')
    await updateFieldInDB('rooms', data.roomId, 'game_is_timer_active', false)
    
    setGameStage(data.roomId, 1)

    const uList = await getRoomsList()
    this.in(GAME_HALL_ID).emit('setRoomsList', uList); //emit in hall
    
    distributeRoles(currRoom) //распределить роли
    openNewGameStep(data.roomId)

    //!!!
    return
    currRoom.gameData.timerID = setInterval(() => {
      currRoom.gameData.timeCounter --

      if (currRoom.gameData.timeCounter <= 0) {
        //еще не увеличился счетчик gameStage, поэтому это конец 2 или 4 этапов
        if (currRoom.gameData.gameStage === 2)
          killPlayer(data.roomId, true)
        if (currRoom.gameData.gameStage === 4)
          killPlayer(data.roomId)
        
        if (!isEndGameCheck(data.roomId)) {
          //new step
          setGameStage(data.roomId, currRoom.gameData.gameStage < 4 ? currRoom.gameData.gameStage + 1 : 1)
          openNewGameStep(data.roomId)
        } else {
          //end game
          setGameStage(data.roomId, 5)
          clearTimer(data.roomId)
          this.in(data.roomId).emit('updateGameTitle', 'Игра окончена');
          this.to(data.roomId).emit("updateUsers", currRoom.users);
          
          endGameActions(data.roomId)
        }
      }

    }, 1000);
  }

  const endGameActions = (roomId) => {
    const currRoom = rooms.find(room => room.id === roomId);

    //результат игры
    const gameRezult = {
      winnerTeam: currRoom.gameData.winnerTeam
    }
    this.in(roomId).emit('showGameResult', gameRezult); 
    this.in(roomId).emit('updateVoicesCount', {});

    //отписать всех от сокетов комнаты
    rooms.find(room => room.id === roomId).users.forEach(user => {
      //score
      const team = ['mafia', 'terrorist', 'barmen'].includes(user.role) ? 'mafia' : 'citizen'
      const isInWinnerTeam = currRoom.gameData.winnerTeam === team
      
      let score = (isInWinnerTeam && (user.isLive || user.role === 'terrorist')) ? 50 : 10
      if (users.find(u => u.id === user.id).accountType === 'premium')
        score *= 2
        
      users.find(u => u.id === user.id).rating += score
      this.to(user.socketId).emit("setWinnerScore", score)

      //stats
      users.find(u => u.id === user.id).statistics.allGames.count += 1
      users.find(u => u.id === user.id).statistics.allGames.score += score

      if (isInWinnerTeam && team === 'mafia') {
        users.find(u => u.id === user.id).statistics.mafiaWins.count += 1
        users.find(u => u.id === user.id).statistics.mafiaWins.score += score
      }

      if (isInWinnerTeam && team === 'citizen') {
        users.find(u => u.id === user.id).statistics.citizenWins.count += 1
        users.find(u => u.id === user.id).statistics.citizenWins.score += score
      }

      if (user.role == 'mafia') {
        users.find(u => u.id === user.id).statistics.wasMafia.count += 1
        users.find(u => u.id === user.id).statistics.wasMafia.score += score
      }

      if (user.role == 'sheriff') {
        users.find(u => u.id === user.id).statistics.wasSheriff.count += 1
        users.find(u => u.id === user.id).statistics.wasSheriff.score += score
      }

      if (user.role == 'doctor') {
        users.find(u => u.id === user.id).statistics.wasDoctor.count += 1
        users.find(u => u.id === user.id).statistics.wasDoctor.score += score
      }

      if (user.role == 'lover') {
        users.find(u => u.id === user.id).statistics.wasLover.count += 1
        users.find(u => u.id === user.id).statistics.wasLover.score += score
      }

      if (user.role == 'terrorist') {
        users.find(u => u.id === user.id).statistics.wasTerrorist.count += 1
        users.find(u => u.id === user.id).statistics.wasTerrorist.score += score
      }

      if (user.role == 'barmen') {
        users.find(u => u.id === user.id).statistics.wasBarmen.count += 1
        users.find(u => u.id === user.id).statistics.wasBarmen.score += score
      }

      if (user.role == 'bodyguard') {
        users.find(u => u.id === user.id).statistics.wasBodyguard.count += 1
        users.find(u => u.id === user.id).statistics.wasBodyguard.score += score
      }

      //leave
      this.sockets.get(user.socketId)?.leave(roomId);
    })

    //удалить комнату
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      rooms.splice(roomIndex, 1);
    }
  }

  const isEndGameCheck = (roomId) => {
    const users = rooms.find(room => room.id === roomId).users.filter(user => user.isLive)
    const mafiaCount = users.filter(user => ['mafia', 'barmen', 'terrorist'].includes(user.role)).length
    
    if (mafiaCount === 0 || mafiaCount === users.length) {
      if (mafiaCount === 0)
        rooms.find(room => room.id === roomId).gameData.winnerTeam = 'citizen'
      else rooms.find(room => room.id === roomId).gameData.winnerTeam = 'mafia'
      sendChatMsg(roomId, 'server', mafiaCount === 0 ? 'Победили мирные жители' : 'Мафия победила', false) 
      return true
    } else return false
  }

  //--------------------------------------------------------------------------------
  //enter game hall
  //--------------------------------------------------------------------------------
  socket.on('enterGameHall', async (data, cb) => {  // data: { userId }
    try {
      if (!data.userId)
        return cb({ status: 'error', text: 'User data in not correct' })

        socket.join(GAME_HALL_ID); //join user to game hall
        
        const list = await getRoomsList()
        socket.emit('setRoomsList', list)
        
        return cb({ status: 'ok' });
    } catch (error) {
      return cb({ status: 'error', text: 'Error in enterGameHall' })
    }
  })

  //--------------------------------------------------------------------------------
  // enter room
  //--------------------------------------------------------------------------------
  socket.on('enterRoom', async (data, cb) => { // data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId)
      return cb({ status: 'error', text: 'Invalid request. No user id or room id found' })

    const currRoom = await getTableData('rooms', data.roomId)
    const currUser = await getTableData('users', data.userId)

    if (!currRoom) 
      return res.json(resFormat('error', 'Room with such id is not found'))

    if (!currUser) 
      return res.json(resFormat('error', 'User with such id is not found'))

    let currRoomUsersCount = currRoom.users.length

    //Вы уже играете в другой комнате
    const userInRoom = await pool.query('SELECT * FROM rooms WHERE EXISTS ( SELECT * FROM jsonb_array_elements(users) u WHERE u->>\'id\' = $1 );', [data.userId])

    if (userInRoom.rows.some(r => r.id !== data.roomId))
      return cb({ status: 'error', text: 'You are already playing in other room' });
    
    //chat
    socket.emit('clearChat')
    
    //игрок числится в комнате
    const isAlreadyInThisRoom = currRoom.users.some((user) => user.id === data.userId)

    if (!isAlreadyInThisRoom) { //игрок не числится в комнате
      if (currRoomUsersCount >= currRoom.max_persons) //check max players
        return cb({ status: 'error', text: 'The room already has the maximum number of players' });

      if (currRoom.status === 'playing') //check if game is started
        return cb({ status: 'error', text: 'The game in this room has already begun' });
    } else { 
      //игрок уже числится в комнате - восстановить ему все данные и обновить сокет ид
      //!!!
      // currRoom.users.find(user => user.id === data.userId).socketId = socket.id
      // returnDataToFallenUser(data.userId, data.roomId)
    }

    //ok
    cb({ status: 'ok' });

    socket.leave(GAME_HALL_ID)
    socket.join(data.roomId) //join user to room

    if (currRoom.status !== 'playing') {
      sendChatMsg(data.roomId, 'server', `Присоединился игрок ${currUser.nickname}`, false)   
      //add user
      const newRoomData = await pool.query('UPDATE rooms SET users = users || $1 WHERE id = $2 RETURNING users', 
        [{ 
          socketId: socket.id,
          id: currUser.id,
          nickname: currUser.nickname,
          gender: currUser.gender,
          role: 'unknown',
          isLive: true,
          labels: [],
          isActionSend: false
         }, 
         data.roomId
        ])
      currRoomUsersCount ++;
      this.in(data.roomId).emit('updateUsers', newRoomData.rows[0].users); //update users in room
      const roomsList = await getRoomsList()
      this.in(GAME_HALL_ID).emit('setRoomsList', roomsList); //update in hall
    }

    if (currRoom.status === 'collecting') {
      socket.emit('updateGameTitle', 'Набор игроков');
      socket.emit('setCountdown', 0)
    }
    
    if (currRoom.status === 'countdown') {
      socket.emit('updateGameTitle', 'Игра начнется через:');
      socket.emit('setCountdown', currRoom.game_time_counter)  //???
    }

    //check min for start
    if (currRoomUsersCount == currRoom.min_persons && currRoom.status === 'collecting') {
      await updateFieldInDB('rooms', data.roomId, 'game_timer_counter', STEPS_TIMER_COUNT)
      this.in(data.roomId).emit('setCountdown', STEPS_TIMER_COUNT);

      await updateFieldInDB('rooms', data.roomId, 'status', 'countdown')
      this.in(data.roomId).emit('updateGameTitle', 'Игра начнется через:');

      const roomsList = await getRoomsList()
      this.in(GAME_HALL_ID).emit('setRoomsList', roomsList); //update in hall

      let intervalCounter = STEPS_TIMER_COUNT
      await updateFieldInDB('rooms', data.roomId, 'game_is_timer_active', true)
      
      const intervalId = setInterval(function(){
        const isTimerActive = getFieldValue('rooms', data.roomId, 'game_is_timer_active')
        pool.query('UPDATE rooms SET game_timer_counter = game_timer_counter - 1 WHERE id = $1', [data.roomId])
        intervalCounter --
        if (!isTimerActive)
          clearInterval(intervalId)
        if (intervalCounter <= 0) {
          clearInterval(intervalId)
          startGame(data)
        }
      }, 1000)
    }
  })

  //--------------------------------------------------------------------------------
  //leave the room
  //--------------------------------------------------------------------------------
  socket.on('leaveRoom', async (data, cb) => { //data: { userId, nickname, roomId }
    try {
      if (!data.userId || !data.roomId)
        return cb({ status: 'error', text: 'invalid request. No user id or room id found' })

      const currRoom = await getTableData('rooms', data.roomId)
      const currUser = await getTableData('users', data.userId)
  
      if (!currRoom) 
        return res.json(resFormat('error', 'Room with such id is not found'))
  
      if (!currUser) 
        return res.json(resFormat('error', 'User with such id is not found'))

      cb({ status: 'ok' });
      socket.leave(data.roomId); //left the room

      if (currRoom.status !== 'playing') {
        sendChatMsg(data.roomId, 'server', `Игрок ${currUser.nickname} вышел`, false)

        //remove user
        const updatedUsers = currRoom.users.filter((user) => user.id !== data.userId)
        await updateFieldInDB('rooms', data.roomId, 'users', JSON.stringify(updatedUsers))
        this.in(data.roomId).emit('updateUsers', updatedUsers)
        const uList = await getRoomsList()
        this.in(GAME_HALL_ID).emit('setRoomsList', uList); //update in hall
      }

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length - 1 < currRoom.min_persons){
        this.in(data.roomId).emit('updateGameTitle', 'Набор игроков')
        this.in(data.roomId).emit('setCountdown', 0);
        await updateFieldInDB('rooms', data.roomId, 'status', 'collecting')
        await updateFieldInDB('rooms', data.roomId, 'game_is_timer_active', false)
      }

    } catch (error) {
      return cb({ status: 'error', text: 'Error in leaveRoom' })
    }
  })

  //--------------------------------------------------------------------------------
  //send msg
  //--------------------------------------------------------------------------------
  socket.on('sendMsg', async (data, cb) => { //data: { userId, nickname, roomId, msgText }
    try {
      if (!data.userId || !data.roomId)
        return cb({ status: 'error', text: 'Данные пользователя не корректны' })
      
      const currRoom = await getTableData('rooms', data.roomId)
      const currUser = await getTableData('users', data.userId)
      
      if (!currRoom || !currUser)
        return cb({ status: 'error', text: 'Room or user not found' })
      
      if (!currRoom.game_chat_enable)
        return cb({ status: 'error', text: 'You cant send message now' })

      if (currRoom.game_mafia_in_chat && currRoom.users.find(usr => usr.id === currUser.id).role !== 'mafia')
        return cb({ status: 'error', text: 'You cant send message now. Mafia in chat' })

      //ok
      cb({ status: 'ok' });

      const labels = currRoom.users.find((user) => user.id === currUser.id).labels
      sendChatMsg(data.roomId, data.nickname, 
        !labels.includes('barmen') ? data.msgText : shuffle(data.msgText), 
        currRoom.game_mafia_in_chat
      )
    } catch (error) {
      return cb({ status: 'error', text: 'Error in sendMsg' })
    }
    
  })

  //--------------------------------------------------------------------------------
  //game actions
  //--------------------------------------------------------------------------------
  socket.on('gameAction', (data, cb) => { //data: { userId, roomId, actionIds = [] }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);

      if (!currRoom.users.find(user => user.id === currUser.id).isLive) {
        cb({ status: 'error', text: 'Вы мертвы' })
        return
      }

      if (!data?.actionIds?.length) {
        cb({ status: 'error', text: 'No action ids' })
        return
      }

      if ( !currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
        cb({ status: 'error', text: 'Requested user is not alive. Yoo can not affect him' })
        return
      }

      const role = currRoom.users.find((user) => user.id === currUser.id).role
      const labels = currRoom.users.find((user) => user.id === currUser.id).labels
      const gameStage = currRoom.gameData.gameStage

      if (labels.includes('lover')) {
        cb({ status: 'error', text: 'You can not use action. You are affected by lover' })
        return
      }

      //kill
      if ( role === 'mafia' && gameStage === 2 ) {
        if (currRoom.gameData.votedUsers.includes(currUser.id)) {
          cb({ status: 'error', text: 'You have already voted' })
          return
        }
        if (!currRoom.users.find(user => user.id === data.actionIds[0]).labels.includes('bodyguard')) {
          currRoom.gameData.killsCandidates.push(data.actionIds[0])
          currRoom.gameData.votedUsers.push(currUser.id)
          updateActionSend(data.roomId, data.userId, true)
          const candidatesWithVoiceCount = currRoom.gameData.killsCandidates.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1
            return acc
          }, {});
          currRoom.users.filter((user) => user.role === 'mafia').forEach( user =>
            this.to(user.socketId).emit("updateVoicesCount", candidatesWithVoiceCount)
          )
          const candNick = currRoom.users.find(user => user.id === data.actionIds[0]).nickname
          sendChatMsg(data.roomId, currRoom.users.find((user) => user.id === currUser.id).nickname, `Я голосую против ${candNick}`, true)
        }
      }

      if ( gameStage === 4 && !labels.includes('barmen') ) {
        if (currRoom.gameData.votedUsers.includes(currUser.id)) {
          cb({ status: 'error', text: 'You have already voted' })
          return
        }
        currRoom.gameData.killsCandidates.push(data.actionIds[0])
        currRoom.gameData.votedUsers.push(currUser.id)
        updateActionSend(data.roomId, data.userId, true)
        //count voices
        const candidatesWithVoiceCount = currRoom.gameData.killsCandidates.reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1
          return acc
        }, {});
        this.in(data.roomId).emit('updateVoicesCount', candidatesWithVoiceCount);
        const candNick = currRoom.users.find(user => user.id === data.actionIds[0]).nickname
        sendChatMsg(data.roomId, currRoom.users.find((user) => user.id === currUser.id).nickname, `Я голосую против ${candNick}`, false)
      }

      //sheriff
      if ( role === 'sheriff' && gameStage === 2) {
        const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
        if (!selectedUser.labels.includes('sheriff')) {
          const currUserSocket = currRoom.users.find(user => user.id === currUser.id).socketId
          
          setLabel(data.roomId, data.actionIds[0], 'sheriff')
          updateActionSend(data.roomId, data.userId, true)
          this.to(currUserSocket).emit('updateUserData', selectedUser);
        } else {
          cb({ status: 'error', text: 'Selected user has already been checked by sheriff' })
          return
        }
      }

      //reporter
      if ( role === 'reporter' && gameStage === 2 && data?.actionIds?.length > 1) {
        if (currRoom.users.find((user) => user.id === data.actionIds[0]).labels.includes('reporter') || 
            currRoom.users.find((user) => user.id === data.actionIds[1]).labels.includes('reporter')  
        ) {
          cb({ status: 'error', text: 'At leat one of the users have been already checked by reporter' })
          return
        }
        if ( currRoom.users.find((user) => user.id === data.actionIds[1]).isLive ) {
          setLabel(data.roomId, data.actionIds[0], 'reporter')
          setLabel(data.roomId, data.actionIds[1], 'reporter')
          updateActionSend(data.roomId, data.userId, true)

          const isMafia1 = ['mafia', 'barmen', 'terrorist'].includes( currRoom.users.find((user) => user.id === data.actionIds[0]).role )
          const isMafia2 = ['mafia', 'barmen', 'terrorist'].includes( currRoom.users.find((user) => user.id === data.actionIds[1]).role )

          const user1 = currRoom.users.find((user) => user.id === data.actionIds[0])
          const user2 = currRoom.users.find((user) => user.id === data.actionIds[1])
          
          const isOneTeam = (isMafia1 && isMafia2) || (!isMafia1 && !isMafia2) ? true : false
          const txt = isOneTeam ? 'одной команде' : 'разных командах'

          sendChatMsg(data.roomId, 'server', `Игроки ${user1.nickname} и ${user2.nickname} играют в ${txt}`, false)
          
          const currUserSocket = currRoom.users.find(user => user.id === currUser.id).socketId
          this.to(currUserSocket).emit('updateUserData', {
            socketId: user1.socketId,
            id: user1.id,
            nickname: user1.nickname,
            gender: user1.gender,
            role: 'unknown',
            isLive: user1.isLive,
            labels: user1.labels,
            isActionSend: user1.isActionSend
          });
          this.to(currUserSocket).emit('updateUserData', {
            socketId: user2.socketId,
            id: user2.id,
            nickname: user2.nickname,
            gender: user2.gender,
            role: 'unknown',
            isLive: user2.isLive,
            labels: user2.labels,
            isActionSend: user2.isActionSend
          });
        }
      }

      //lover
      if ( role === 'lover' && gameStage === 1) {
        setLabel(data.roomId, data.actionIds[0], 'lover')
        updateActionSend(data.roomId, data.userId, true)
      }

      //doctor & barmen
      if ( (role === 'doctor' || role === 'barmen') && gameStage === 2) {
        setLabel(data.roomId, data.actionIds[0], role)
        updateActionSend(data.roomId, data.userId, true)
      }

      //bodyguard
      if ( role === 'bodyguard' && gameStage === 3) {
        setLabel(data.roomId, data.actionIds[0], 'bodyguard')
        updateActionSend(data.roomId, data.userId, true)
      }

      //terrorist
      if ( role === 'terrorist' && gameStage === 4) {
        let msgText;
        const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
        const myNickname = currRoom.users.find((user) => user.id === data.userId).nickname

        killInstantly(data.roomId, data.userId) //взорвался

        if (!selectedUser.labels.includes('bodyguard')) {
          killInstantly(data.roomId, data.actionIds[0]) //взорвал
          if (selectedUser.role === 'bodyguard') //если взорвали боди - убрать лейбы защиты
            removeBodyguardLabel(data.roomId)
          msgText = `${myNickname} взорвал ${selectedUser.nickname}`;
          currRoom.gameData.killsCandidates = currRoom.gameData.killsCandidates.filter(candId => candId !== data.actionIds[0]) //убрать из голосования
        } else {
          msgText = `Игрок ${myNickname} не смог взорвать ${selectedUser.nickname}`
        }

        sendChatMsg(data.roomId, 'server', msgText, false)
      }
        
      //ok
      cb({ status: 'ok' });
    }
  })

  //--------------------------------------------------------------------------------
  //disconnect
  //--------------------------------------------------------------------------------
  socket.on("disconnect", async () => {
    try {
      const roomsWithUser = await pool.query('SELECT * FROM rooms WHERE EXISTS ( SELECT * FROM jsonb_array_elements(users) u WHERE u->>\'socketId\' = $1 );', [socket.id])
      // console.log(roomsWithUser);
      const currRoom = roomsWithUser.rows[0]

      if (currRoom?.status !== 'playing') {
        socket.leave(currRoom.id);
  
        sendChatMsg(currRoom.id, 'server', `Игрок ${currRoom.users.find(user => user.socketId === socket.id).nickname} вышел`, false)
  
        //remove user
        const updatedUsers = currRoom.users.filter((user) => user.socketId !== socket.id)
        await updateFieldInDB('rooms', currRoom.id, 'users', JSON.stringify(updatedUsers))
        this.in(currRoom.id).emit('updateUsers', updatedUsers)
        const uList = await getRoomsList();
        this.in(GAME_HALL_ID).emit('setRoomsList', uList); //update in hall
  
        //check if was countdown
        if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.min_persons){
          await updateFieldInDB('rooms', currRoom.id, 'status', 'collecting')
          await updateFieldInDB('rooms', currRoom.id, 'game_is_timer_active', false)
          this.in(currRoom.id).emit('updateGameTitle', 'Набор игроков')
        }
      }
    } catch (error) {
      console.log('Error in disconnect', error.message);
    }
  });
}

module.exports = mySocket

// UPDATE rooms
// SET users = jsonb_set(users, 
//     (SELECT ARRAY_POSITION(users, u) FROM jsonb_array_elements(users) u WHERE u->>'id' = 'user_id' LIMIT 1), 
//     jsonb_set(users->(SELECT ARRAY_POSITION(users, u) FROM jsonb_array_elements(users) u WHERE u->>'id' = 'user_id' LIMIT 1), '{socketId}', '"new_socket_id"')
// )
// WHERE id = 'room_id';

// const updatedUsers = currRoom.users.filter((user) => user.id !== data.userId)
// await updateFieldInDB('rooms', data.roomId, 'users', JSON.stringify(updatedUsers))