const getRolesCount = require('../game/getRolesCount')
const { shuffle } = require('../use/additional')
const { rooms, users, gameHallId } = require('../data')

const STEPS_TIMER_COUNT = 30; //60 csec

const getRoomsList = () => rooms.map( ({ id, name, maxPersons, minPersons, roles, users, status }) =>
    ({ id, name, maxPersons, minPersons, roles, usersCount: users.length, status}) )


// Main function
function mySocket(socket) {

  const clearTimer = (roomId) => {
    this.in(roomId).emit('setCountdown', 0);
    clearInterval(rooms.find(r => r.id === roomId).gameData.timerID)
    rooms.find(r => r.id === roomId).gameData.timerID = null
    rooms.find(r => r.id === roomId).gameData.timeCounter = 0
  }

  const sendChatMsg = (roomId, author, text, isHidden) => {
    rooms.find(room => room.id === roomId).chat.push({ author, text, isHidden });

    if (!isHidden)
        this.in(roomId).emit('newChatMsg', { author, text, isHidden });  
    else 
      rooms.find(room => room.id === roomId).users
        .filter(user => user.role === 'mafia')
        .forEach(user => this.to(user.socketId).emit("newChatMsg", { author, text, isHidden }))
  }

  const sendGameDataToRoom = (roomId, title, isChatEnable, isMaffiaInChat) => {
    const currRoom = rooms.find(room => room.id === roomId)

    this.in(roomId).emit('updateGameTitle', title);

    this.in(roomId).emit('chatEnable', isChatEnable);
    currRoom.gameData.chatEnable = isChatEnable
    currRoom.gameData.mafiaInChat = isMaffiaInChat
    
    this.in(roomId).emit('setCountdown', currRoom.gameData.timeCounter);
  }

  const setGameStage = (roomId, stage) => {
    rooms.find(room => room.id === roomId).gameData.gameStage = stage
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

  const distributeRoles = (currRoom) => {
    const roles = getRolesCount(currRoom.users.length, currRoom.roles)
    const rolesEntries = Object.entries(roles)

    //распределить роли
    currRoom.users.forEach((user) => {
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

    //мафия видит мафию
    currRoom.users.filter((user) => user.role === 'mafia').forEach( user =>
      this.to(user.socketId).emit("updateUsers", currRoom.users.map( ({ socketId, id, nickname, gender, role, isLive, labels, isActionSend }) => 
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

  const clearLabelsList = (roomId) => {
    rooms.find(room => room.id === roomId).users.forEach((user) => {
      user.labels = user.labels.filter(lbl => lbl === 'sheriff' || lbl === 'reporter' || lbl === 'bodyguard');
      this.to(user.socketId).emit('setLabels', user.labels)
    })
  }

  const setLabel = (roomId, actionUserId, labelName) => {
    const selectedUser = rooms.find(room => room.id === roomId).users.find((user) => user.id === actionUserId)
    selectedUser.labels.push(labelName)
    this.to(selectedUser.socketId).emit('setLabel', labelName);
  }

  const removeBodyguardLabel = (roomId) => {
    rooms.find(room => room.id === roomId).users.forEach((user) => {
      user.labels = user.labels.filter(lbl => lbl !== 'bodyguard');
      this.to(user.socketId).emit('setLabels', user.labels)
    })
  }

  //--------------------------------------------------------------------------------

  const clearActionSend = (roomId) => {
    rooms.find(room => room.id === roomId).users.forEach((user) => {
      user.isActionSend = false
      this.to(user.socketId).emit('setActionSend', false)
    })
  }

  const updateActionSend = (roomId, userId, val) => {
    const user = rooms.find(room => room.id === roomId).users.find((user) => user.id === userId)
    user.isActionSend = val
    this.to(user.socketId).emit('setActionSend', val);
  }

  //--------------------------------------------------------------------------------

  const openNewGameStep = (roomId) => {
    const gameStage = rooms.find(room => room.id === roomId).gameData.gameStage
    rooms.find(room => room.id === roomId).gameData.timeCounter = STEPS_TIMER_COUNT
    clearActionSend(roomId)
    this.in(roomId).emit('updateVoicesCount', {});
    this.in(roomId).emit('setMafiaPlayersCount', rooms.find(room => room.id === roomId).users.filter(user => user.isLive && ['mafia', 'barmen', 'terrorist'].includes(user.role)).length);

    if (gameStage === 1) {
      sendGameDataToRoom(roomId, 'Ночь. Мафия в чате', true, true)
      clearLabelsList(roomId)
    }
    if (gameStage === 2) {
      rooms.find(room => room.id === roomId).gameData.votedUsers = []
      sendGameDataToRoom(roomId, 'Мафия выбирает жертву', false, false)
    }
    if (gameStage === 3) {
      sendGameDataToRoom(roomId, 'День. Общее обсуждение', true, false)
      removeBodyguardLabel(roomId)
    }
    if (gameStage === 4) {
      rooms.find(room => room.id === roomId).gameData.votedUsers = []
      sendGameDataToRoom(roomId, 'День. Голосование', false, false)
    }
  }

  //--------------------------------------------------------------------------------

  const startGame = (data) => {
    const currRoom = rooms.find(room => room.id === data.roomId)
    
    clearTimer(data.roomId)
    setGameStage(data.roomId, 1)

    currRoom.status = 'playing';

    this.in(gameHallId).emit('setRoomsList', getRoomsList()); //emit in hall
    
    distributeRoles(currRoom) //распределить роли
    openNewGameStep(data.roomId)

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
  socket.on('enterGameHall', (data, cb) => {  // data: { userId }
    if (!data.userId)
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    else {
      cb({ status: 'ok' });
      socket.join(gameHallId); //join user to game hall
  
      //send room list
      socket.emit('setRoomsList', getRoomsList())
    }
  })

  //--------------------------------------------------------------------------------
  // enter room
  //--------------------------------------------------------------------------------
  socket.on('enterRoom', (data, cb) => { // data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);
      const isAlreadyInThisRoom = currRoom.users.some((user) => user.id === data.userId)

      //Вы уже играете в другой комнате
      if (rooms.filter((r) => r.id !== data.roomId).some((r) => r.users.some((user) => user.id === data.userId))) {
        cb({ status: 'error', text: 'Вы уже играете в другой комнате' });
        return
      }

      //chat
      socket.emit('clearChat')

      if (!isAlreadyInThisRoom) { //игрок не числится в комнате
        if (currRoom.users.length >= currRoom.maxPersons){ //check max players
          cb({ status: 'error', text: 'В комнате уже максимальное количество игроков' });
          return
        }
        if (currRoom.status === 'playing') { //check if game is started
          cb({ status: 'error', text: 'Игра в этой комнате уже началась' });
          return
        }
      } else { 
        //игрок уже числится в комнате - восстановить ему все данные и обновить сокет ид
        currRoom.users.find(user => user.id === data.userId).socketId = socket.id
        returnDataToFallenUser(data.userId, data.roomId)
      }

      //ok
      cb({ status: 'ok' });

      socket.leave(gameHallId)
      socket.join(data.roomId) //join user to room

      if (currRoom.status !== 'playing') {
        sendChatMsg(data.roomId, 'server', `Присоединился игрок ${currUser.nickname}`, false)   
  
        //add user
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
        this.in(data.roomId).emit('updateUsers', currRoom.users); //update users in room
        this.in(gameHallId).emit('setRoomsList', getRoomsList()); //update in hall
      }

      if (currRoom.status === 'collecting') {
        socket.emit('updateGameTitle', 'Набор игроков');
        socket.emit('setCountdown', 0)
      }
      
      if (currRoom.status === 'countdown') {
        socket.emit('updateGameTitle', 'Игра начнется через:');
        socket.emit('setCountdown', currRoom.gameData.timeCounter)  
      }

      //check min for start
      if (currRoom.users.length == currRoom.minPersons && currRoom.status === 'collecting') {
        currRoom.gameData.timeCounter =  STEPS_TIMER_COUNT
        currRoom.status = 'countdown';
        this.in(gameHallId).emit('setRoomsList', getRoomsList()); //update in hall
        this.in(data.roomId).emit('setCountdown', currRoom.gameData.timeCounter);
        this.in(data.roomId).emit('updateGameTitle', 'Игра начнется через:');

        currRoom.gameData.timerID = setInterval(() => {
          currRoom.gameData.timeCounter --
          if (currRoom.gameData.timeCounter <= 0)
            startGame(data)
        }, 1000)
      }
    }
  })

  //--------------------------------------------------------------------------------
  //leave the room
  //--------------------------------------------------------------------------------
  socket.on('leaveRoom', (data, cb) => { //data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId)
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);
      
      if (!currUser) {
        cb({ status: 'error', text: 'User not found' })
        return
      }

      if (!currRoom) { //комнаты может уже не быть после окончания игры
        cb({ status: 'ok' });
        return
      }
      //ok
      cb({ status: 'ok' });

      socket.leave(data.roomId); //left the room

      if (currRoom.status !== 'playing') {
        sendChatMsg(data.roomId, 'server', `Игрок ${currUser.nickname} вышел`, false)

        //remove user
        currRoom.users = currRoom.users.filter((user) => user.id !== data.userId)
        this.in(data.roomId).emit('updateUsers', currRoom.users)
        this.in(gameHallId).emit('setRoomsList', getRoomsList()); //update in hall
      }

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.minPersons){
        currRoom.status = 'collecting';
        clearTimer(data.roomId)
        this.in(data.roomId).emit('updateGameTitle', 'Набор игроков')
      }
    }
  })

  //--------------------------------------------------------------------------------
  //send msg
  //--------------------------------------------------------------------------------
  socket.on('sendMsg', (data, cb) => { //data: { userId, nickname, roomId, msgText }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);
      
      if (!currRoom || !currUser) {
        cb({ status: 'error', text: 'Room or user not found' })
        return
      }
      
      if (!currRoom.gameData.chatEnable) {
        cb({ status: 'error', text: 'You cant send message now' })
        return
      }

      if (currRoom.gameData.mafiaInChat && currRoom.users.find(usr => usr.id === currUser.id).role !== 'mafia') {
        cb({ status: 'error', text: 'You cant send message now. Mafia in chat' })
        return
      }

      //ok
      cb({ status: 'ok' });

      const labels = currRoom.users.find((user) => user.id === currUser.id).labels
      sendChatMsg(data.roomId, data.nickname, 
        !labels.includes('barmen') ? data.msgText : shuffle(data.msgText), 
        currRoom.gameData.mafiaInChat
      )
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
  socket.on("disconnect", () => {
    const currRoom = rooms.find(r => r.users.some(user => user.socketId === socket.id))

    if (currRoom && currRoom.status !== 'playing') {
      socket.leave(currRoom.id);

      sendChatMsg(currRoom.id, 'server', `Игрок ${currRoom.users.find(user => user.socketId === socket.id).nickname} вышел`, false)

      //remove user
      currRoom.users = currRoom.users.filter((user) => user.socketId !== socket.id)
      this.in(currRoom.id).emit('updateUsers', currRoom.users)
      this.in(gameHallId).emit('setRoomsList', getRoomsList()); //update in hall

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.minPersons){
        currRoom.status = 'collecting';
        clearTimer(currRoom.id)
        this.in(currRoom.id).emit('updateGameTitle', 'Набор игроков')
      }
    }
  });
}

module.exports = mySocket