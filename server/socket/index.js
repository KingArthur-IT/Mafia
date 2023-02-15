const getRolesCount = require('../game/getRolesCount')
const { rooms, users } = require('../data')

const STEPS_TIMER_COUNT = 30; //60 csec

const shuffle = (str) => {
  var a = str.split(""),
      n = a.length;

  for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
  }
  return a.join("");
}

// Main function
function mySocket(socket) {

  const clearTimer = (roomId) => {
    this.in(roomId).emit('setCountdown', 0);
    clearInterval(rooms.find(r => r.id === roomId).gameData.timerID)
    rooms.find(r => r.id === roomId).gameData.timerID = null
    rooms.find(r => r.id === roomId).gameData.timeCounter = 0
  }

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
    currRoom.users.filter((user) => user.role === 'mafia').forEach((user) => {
      this.to(user.socketId).emit("updateUsers", currRoom.users.map((usr) => {
        return {
            socketId: usr.socketId,
            id: usr.id,
            nickname: usr.nickname,
            gender: usr.gender,
            role: usr.role !== 'mafia' && usr.role !== 'terrorist' ? 'unknown' : usr.role,
            isLive: usr.isLive,
            labels: usr.labels
        }
    }))
    })
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
        acc[curr] = 0 | acc[curr] + 1
        return acc
      }, {});

      //find max voices
      let candidates = []; //ids of candidates for killing
      let max = 0 //max voices for candidate

      Object.entries(candidatesWithVoiceCount).forEach(el => {
        if (el[1] > max) {
          max = el[1]
          candidates = [el[0]]
        } else if (el[1] === max) candidates.push(el[0])
      })

      let killIndex = 0

      if (candidates.length > 1) 
        killIndex = Math.round(Math.random() * (candidates.length - 1))

      const killId = Number(candidates[killIndex])

      currRoom.users.find((user) => user.id === killId).isLive = false
      this.in(roomId).emit('updateUserData', currRoom.users.find((user) => user.id === killId));
      this.to(currRoom.users.find((user) => user.id === killId).socketId).emit('wasKilled', true)


      const chatMsg = { 
        author: 'server', 
        text: `Игрок ${currRoom.users.find((user) => user.id === killId).nickname} был убит`, 
        isHidden: false 
      };
      currRoom.chat.push(chatMsg);
      this.in(roomId).emit('newChatMsg', chatMsg);    
    } else {
      const chatMsg = { 
        author: 'server', 
        text: `Все остались живы`, 
        isHidden: false 
      };
      currRoom.chat.push(chatMsg);
      this.in(roomId).emit('newChatMsg', chatMsg);   
    }
    currRoom.gameData.killsCandidates = []
  }

  const isEndGameCheck = (roomId) => {
    const users = rooms.find(room => room.id === roomId).users.filter(user => user.isLive)
    const mafiaCount = users.filter(user => ['mafia', 'barmen', 'terrorist'].includes(user.role)).length
    
    if (mafiaCount === 0 || mafiaCount === users.length) {
      const text = mafiaCount === 0 ? 'Победили мирные жители' : 'Мафия победила'
      const chatMsg = { 
        author: 'server', 
        text: text, 
        isHidden: false 
      };
      rooms.find(room => room.id === roomId).chat.push(chatMsg);
      this.in(roomId).emit('newChatMsg', chatMsg);  
      return true
    } else return false
  }

  const openNewGameStep = (roomId) => {
    const currRoom = rooms.find(room => room.id === roomId)

    //Ночь. Мафия в чате
    if (currRoom.gameData.gameStage === 1) {
      this.in(roomId).emit('updateGameTitle', 'Ночь. Мафия в чате');

      this.in(roomId).emit('chatEnable', true);
      currRoom.gameData.chatEnable = true
      currRoom.gameData.mafiaInChat = true

      this.in(roomId).emit('setCountdown', currRoom.gameData.timeCounter);
    }

    //Мафия выбирает жертву
    if (currRoom.gameData.gameStage === 2) {
      this.in(roomId).emit('updateGameTitle', 'Мафия выбирает жертву');

      this.in(roomId).emit('chatEnable', false);
      currRoom.gameData.chatEnable = false
      currRoom.gameData.mafiaInChat = false

      this.in(roomId).emit('setCountdown', currRoom.gameData.timeCounter);
    }

    //День. Общее обсуждение
    if (currRoom.gameData.gameStage === 3) {
      //start day
      this.in(roomId).emit('updateGameTitle', 'День. Общее обсуждение');

      this.in(roomId).emit('chatEnable', true);
      currRoom.gameData.chatEnable = true

      this.in(roomId).emit('setCountdown', currRoom.gameData.timeCounter);
    }

    //День. Голосование
    if (currRoom.gameData.gameStage === 4) {
      this.in(roomId).emit('updateGameTitle', 'День. Голосование');

      this.in(roomId).emit('chatEnable', false);
      currRoom.gameData.chatEnable = false

      this.in(roomId).emit('setCountdown', currRoom.gameData.timeCounter);
    }
  }

  const startGame = (data) => {
    const currRoom = rooms.find(room => room.id === data.roomId)

    currRoom.status = 'playing';
    clearTimer(data.roomId)
    
    //распределить роли
    distributeRoles(currRoom)
    
    currRoom.gameData.gameStage = 1
    this.in(data.roomId).emit('setGameStage', currRoom.gameData.gameStage);
    currRoom.gameData.timeCounter = STEPS_TIMER_COUNT
    openNewGameStep(data.roomId)

    currRoom.gameData.timerID = setInterval(() => {
      currRoom.gameData.timeCounter --

      if (currRoom.gameData.timeCounter <= 0) {
        //еще не увеличился счетчик gameStage, поэтому это конец 2 или 4 этапов
        if (currRoom.gameData.gameStage === 2)
          killPlayer(data.roomId, true)
        //clear labels
        if (currRoom.gameData.gameStage === 4) {
          killPlayer(data.roomId)
          currRoom.users.forEach(user => user.labels = [])
        }
        
        if (!isEndGameCheck(data.roomId)) {
          //new step
          currRoom.gameData.gameStage = currRoom.gameData.gameStage < 4 ? currRoom.gameData.gameStage + 1 : 1
          currRoom.gameData.timeCounter = STEPS_TIMER_COUNT
          openNewGameStep(data.roomId)
        } else {
          //end game
          currRoom.gameData.gameStage = 5
          currRoom.gameData.timeCounter = 0
          clearInterval(currRoom.gameData.timerID)
          currRoom.gameData.timerID = null
          this.in(data.roomId).emit('updateGameTitle', 'Игра окончена');
          this.to(data.roomId).emit("updateUsers", currRoom.users);
        }
        this.in(data.roomId).emit('setGameStage', currRoom.gameData.gameStage);
      }
    }, 1000);

  }

  // enter room
  socket.on('enterRoom', (data, cb) => { // data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);

      //check max players
      if (currRoom.users.length >= currRoom.maxPersons){
        cb({ status: 'error', text: 'В комнате уже максимальное количество игроков' });
        return
      }

      //check if game is started
      if (currRoom.status === 'playing' && !currRoom.users.some((user) => user.id === data.userId)) {
        cb({ status: 'error', text: 'Игра в этой комнате уже началась' });
        return
      }

      //Вы уже играете в другой комнате
      if (rooms.filter((r) => r.id !== data.roomId).some((r) => r.users.some((user) => user.id === data.userId))) {
        cb({ status: 'error', text: 'Вы уже играете в другой комнате' });
        return
      }

      //chat
      socket.emit('clearChat')
      if (currRoom.users.some((user) => user.id === data.userId)) {
        if (currRoom.users.find(usr => usr.id === currUser.id).role === 'mafia')
          socket.emit('copyChat', currRoom.chat)
        else socket.emit('copyChat', currRoom.chat.filter((msg) => !msg.isHidden))
      }

      //ok
      cb({ status: 'ok' });

      socket.join(data.roomId); //join user to room

      if (currRoom.status !== 'playing') {
        //msg to chat
        const chatMsg = { 
          author: 'server', 
          text: `Присоединился игрок ${currUser.nickname}`, 
          isHidden: false 
        };
        currRoom.chat.push(chatMsg);
        this.in(data.roomId).emit('newChatMsg', chatMsg);     
  
        //add user
        currRoom.users.push({
          socketId: socket.id,
          id: currUser.id,
          nickname: currUser.nickname,
          gender: currUser.gender,
          role: 'unknown',
          isLive: true,
          labels: []
        });
        this.in(data.roomId).emit('updateUsers', currRoom.users);
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
        this.in(data.roomId).emit('setCountdown', currRoom.gameData.timeCounter);
        this.in(data.roomId).emit('updateGameTitle', 'Игра начнется через:');

        currRoom.gameData.timerID = setInterval(() => {
          currRoom.gameData.timeCounter --
          if (currRoom.gameData.timeCounter <= 0) {
            // game start
            startGame(data)
          }
        }, 1000)
      }
    }
  })

  //leave the room
  socket.on('leaveRoom', (data, cb) => { //data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      const currRoom = rooms.find(room => room.id === data.roomId);
      const currUser = users.find(user => user.id === data.userId);
      
      if (!currRoom || !currUser) {
        cb({ status: 'error', text: 'Room or user not found' })
        return
      }
      //ok
      cb({ status: 'ok' });

      socket.leave(data.roomId); //left the room

      if (currRoom.status !== 'playing') {
        //msg to chat
        const chatMsg = { 
          author: 'server', 
          text: `Игрок ${currUser.nickname} вышел`, 
          isHidden: false 
        };
        currRoom.chat.push(chatMsg);
        this.in(data.roomId).emit('newChatMsg', chatMsg);  
  
        //remove user
        currRoom.users = currRoom.users.filter((user) => user.id !== data.userId)
        this.in(data.roomId).emit('updateUsers', currRoom.users);
      }

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.minPersons){
        currRoom.status = 'collecting';
        if ( currRoom.gameData.timerID ) {
          clearInterval(currRoom.gameData.timerID)
          currRoom.gameData.timerID = null
          currRoom.gameData.timeCounter = 0
        }
        this.in(data.roomId).emit('setCountdown', 0)
        this.in(data.roomId).emit('updateGameTitle', 'Набор игроков')
      }
    }
  })

  //send msg
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
      //msg to chat
      const chatMsg = { 
        author: data.nickname, 
        text: !labels.includes('barmen') ? data.msgText : shuffle(data.msgText), 
        isHidden: currRoom.gameData.mafiaInChat 
      };
      
      currRoom.chat.push(chatMsg);
      if (!currRoom.gameData.mafiaInChat)
        this.in(data.roomId).emit('newChatMsg', chatMsg);  
      else 
        currRoom.users.forEach((user) => {
          if (user.role == 'mafia')
            this.to(user.socketId).emit("newChatMsg", chatMsg)
        })
    }
  })

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

      const role = currRoom.users.find((user) => user.id === currUser.id).role
      const labels = currRoom.users.find((user) => user.id === currUser.id).labels

      if (labels.includes('lover')) {
        cb({ status: 'error', text: 'U R by lover' })
        return
      }

      //kill
      if ( role === 'mafia' && currRoom.gameData.gameStage === 2 ) {
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive )
          currRoom.gameData.killsCandidates.push(data.actionIds[0])
      }

      if ( currRoom.gameData.gameStage === 4 && !labels.includes('barmen')) {
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive )
          currRoom.gameData.killsCandidates.push(data.actionIds[0])
      }

      //sheriff
      if ( role === 'sheriff' && currRoom.gameData.gameStage === 2)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          const currUserSocket = currRoom.users.find(user => user.id === currUser.id).socketId
          this.to(currUserSocket).emit('updateUserData', selectedUser);
          this.to(selectedUser.socketId).emit('wasWatched', true);
        }

      //reporter
      if ( role === 'reporter' && currRoom.gameData.gameStage === 2 && data?.actionIds?.length > 1)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive &&
             currRoom.users.find((user) => user.id === data.actionIds[1]).isLive
        ) {
          const isMafia1 = ['mafia', 'barmen', 'terrorist'].includes( currRoom.users.find((user) => user.id === data.actionIds[0]).role )
          const isMafia2 = ['mafia', 'barmen', 'terrorist'].includes( currRoom.users.find((user) => user.id === data.actionIds[1]).role )

          const nickname1 = currRoom.users.find((user) => user.id === data.actionIds[0]).nickname
          const nickname2 = currRoom.users.find((user) => user.id === data.actionIds[1]).nickname
          
          const isOneTeam = (isMafia1 && isMafia2) || (!isMafia1 && !isMafia2) ? true : false
          const txt = isOneTeam ? 'одной команде' : 'разных командах'

          //msg to chat
          const chatMsg = { 
            author: 'server', 
            text: `Игроки [${nickname1}] [${nickname2}] играют в ${txt}`, 
            isHidden: false 
          }
          currRoom.chat.push(chatMsg)
          this.in(data.roomId).emit('newChatMsg', chatMsg)
        }

      //lover
      if ( role === 'lover' && currRoom.gameData.gameStage === 1)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          selectedUser.labels.push('lover')
          this.to(selectedUser.socketId).emit('setLabel', 'lover');
        }

      //doctor
      if ( role === 'doctor' && currRoom.gameData.gameStage === 2)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          selectedUser.labels.push('doctor')
          this.to(selectedUser.socketId).emit('setLabel', 'doctor');
        }

      //barmen
      if ( role === 'barmen' && currRoom.gameData.gameStage === 2)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          selectedUser.labels.push('barmen')
          this.to(selectedUser.socketId).emit('setLabel', 'barmen');
        }

      //bodyguard
      if ( role === 'bodyguard' && currRoom.gameData.gameStage === 3)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          selectedUser.labels.push('bodyguard')
          this.to(selectedUser.socketId).emit('setLabel', 'bodyguard');
        }

      //terrorist
      if ( role === 'terrorist' && currRoom.gameData.gameStage === 4)
        if ( currRoom.users.find((user) => user.id === data.actionIds[0]).isLive ) {
          let chatMsg;
          const selectedUser = currRoom.users.find((user) => user.id === data.actionIds[0])
          const me = currRoom.users.find((user) => user.id === currUser.id)

          currRoom.users.find((user) => user.id === currUser.id).isLive = false
          this.in(currRoom.id).emit('updateUserData', currRoom.users.find((user) => user.id === currUser.id));
          this.to(me.socketId).emit('wasKilled', true);

          if (!selectedUser.labels.includes('bodyguard')) {
            currRoom.users.find((user) => user.id === data.actionIds[0]).isLive = false
            this.in(currRoom.id).emit('updateUserData', currRoom.users.find((user) => user.id === data.actionIds[0]));
            this.to(selectedUser.socketId).emit('wasKilled', true);
            chatMsg = { 
              author: 'server', text: `${me.nickname} взорвал ${selectedUser.nickname}`, isHidden: false 
            };
          } else {
            chatMsg = { 
              author: 'server', text: `Игрок ${me.nickname} не смог взорвать ${selectedUser.nickname}`, isHidden: false 
            }
          }

          currRoom.chat.push(chatMsg);
          this.in(currRoom.id).emit('newChatMsg', chatMsg); 
        }
        
      //ok
      cb({ status: 'ok' });
    }
  })
}

module.exports = mySocket