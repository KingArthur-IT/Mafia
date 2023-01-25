const getRolesCount = require('../game/getRolesCount')
const { rooms, users } = require('../data')

const PRE_START_TIMER = 20; //60 csec

var gameTimer = null,
    timeCount = 0,
    currRoom = null,
    currUser = null,
    gameStage = 1

function mySocket(socket) {

  const clearTimer = (roomId) => {
    this.in(roomId).emit('setCountdown', 0);
    clearInterval(gameTimer)
    gameTimer = null
    timeCount = 0
  }

  const distributeRoles = () => {
    const roles = getRolesCount(currRoom.users.length, currRoom.roles)
    const rolesEntries = Object.entries(roles)

    //распределить роли
    currRoom.users.forEach((user) => {
        if (rolesEntries.length) {
            const rand = Math.floor( Math.random() * (rolesEntries.length - 1) )
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
                role: usr.role !== 'mafia' && usr.role !== 'terrorist' ? 'unknown' : usr.role
            }
        }))
    })
  }

  const startGame = (data) => {
    this.in(data.roomId).emit('updateGameStage', 'Ночь. Мафия в чате');
    currRoom.status = 'playing';
    clearTimer(data.roomId)

    //распределить роли
    distributeRoles()


    
  }

  // enter room
  socket.on('enterRoom', (data, cb) => { // data: { userId, nickname, roomId }
    if (!data.userId || !data.roomId){
      return cb({ status: 'error', text: 'Данные пользователя не корректны' })
    } else {
      currRoom = rooms.find(room => room.id === data.roomId);
      currUser = users.find(user => user.id === data.userId);

      //check max players
      if (currRoom.users.length >= currRoom.maxPersons){
        cb({ status: 'error', text: 'В комнате уже максимальное количество игроков' });
        return
      }

      //check if game is started
      if (currRoom.status === 'playing' && !currRoom.users.some((user) => user.id === data.userId)){
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
      if (currRoom.users.some((user) => user.id === data.userId)){
        socket.emit('copyChat', currRoom.chat)
      }

      //ok
      cb({ status: 'ok' });

      socket.join(data.roomId); //join user to room

      if (currRoom.status !== 'playing') {
        //msg to chat
        const chatMsg = { author: 'server', text: `Присоединился игрок ${currUser.nickname}` };
        currRoom.chat.push(chatMsg);
        this.in(data.roomId).emit('newChatMsg', chatMsg);    
  
        //add user
        currRoom.users.push({
          socketId: socket.id,
          id: currUser.id,
          nickname: currUser.nickname,
          gender: currUser.gender,
          role: 'unknown' 
        });
        this.in(data.roomId).emit('updateUsers', currRoom.users);
      }

      if (currRoom.status === 'collecting') {
        socket.emit('updateGameStage', 'Набор игроков');
        socket.emit('setCountdown', 0)
      }
      
      if (currRoom.status === 'countdown') {
        socket.emit('updateGameStage', 'Игра начнется через:');
        socket.emit('setCountdown', timeCount)  
      }

      //check min for start
      if (currRoom.users.length == currRoom.minPersons && currRoom.status === 'collecting') {
        currRoom.status = 'countdown';
        timeCount = PRE_START_TIMER
        this.in(data.roomId).emit('setCountdown', timeCount);
        this.in(data.roomId).emit('updateGameStage', 'Игра начнется через:');

        gameTimer = setInterval(() => {
          timeCount --
          if (timeCount <= 0) {
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
        const chatMsg = { author: 'server', text: `Игрок ${currUser.nickname} вышел` };
        currRoom.chat.push(chatMsg);
        this.in(data.roomId).emit('newChatMsg', chatMsg);  
  
        //remove user
        currRoom.users = currRoom.users.filter((user) => user.id !== data.userId)
        this.in(data.roomId).emit('updateUsers', currRoom.users);
      }

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.minPersons){
        currRoom.status = 'collecting';
        if (gameTimer) {
          clearInterval(gameTimer)
          timeCount = 0
        }
        this.in(data.roomId).emit('setCountdown', 0)
        this.in(data.roomId).emit('updateGameStage', 'Набор игроков')
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
      //ok
      cb({ status: 'ok' });

      //msg to chat
      const chatMsg = { author: data.nickname, text: data.msgText };
      currRoom.chat.push(chatMsg);
      this.in(data.roomId).emit('newChatMsg', chatMsg);  
    }
  })
}

module.exports = mySocket