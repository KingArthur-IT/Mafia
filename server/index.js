const {rooms, users} = require('./data')


const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors())
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
const PORT = process.env.PORT || 3000
const PRE_START_TIMER = 20; //60 csec

const userRouter = require('./routes/user.routes')
const roomsRouter = require('./routes/rooms.routes')

var gameTimer = null,
    timeCount = 0

app.use(express.json());
// app.get('*', (req, res) => {

// })

io.on('connection', (socket) => {

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

      console.log(currRoom.id, currRoom.status);
      socket.join(data.roomId); //join user to room

      if (currRoom.status !== 'playing') {
        //msg to chat
        const chatMsg = { author: 'server', text: `Присоединился пользователь ${currUser.nickname}` };
        currRoom.chat.push(chatMsg);
        io.in(data.roomId).emit('newChatMsg', chatMsg);    
  
        //add user
        currRoom.users.push({
          id: currUser.id,
          nickname: currUser.nickname,
          gender: currUser.gender,
          role: 'unknown' 
        });
        io.in(data.roomId).emit('updateUsers', currRoom.users);
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
        io.in(data.roomId).emit('setCountdown', PRE_START_TIMER);
        io.in(data.roomId).emit('updateGameStage', 'Игра начнется через:');
        timeCount = PRE_START_TIMER

        gameTimer = setInterval(() => {
          timeCount --
          if (timeCount <= 0) {
            io.in(data.roomId).emit('updateGameStage', 'Наступила ночь');
            currRoom.status = 'playing';
            io.in(data.roomId).emit('setCountdown', 0);
            clearInterval(gameTimer)
            gameTimer = null
            timeCount = 0
          }
        }, 1000)
      }
    }
  })

  //leave the room
  socket.on('leaveRoom', (data, cb) => { //data: {userId, nickname, roomId}
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
        const chatMsg = { author: 'server', text: `Пользователь ${currUser.nickname} вышел` };
        currRoom.chat.push(chatMsg);
        io.in(data.roomId).emit('newChatMsg', chatMsg);  
  
        //remove user
        currRoom.users = currRoom.users.filter((user) => user.id !== data.userId)
        io.in(data.roomId).emit('updateUsers', currRoom.users);
      }

      //check if was countdown
      if (currRoom.status === 'countdown' && currRoom.users.length < currRoom.minPersons){
        currRoom.status = 'collecting';
        if (gameTimer) {
          clearInterval(gameTimer)
          timeCount = 0
        }
        io.in(data.roomId).emit('setCountdown', 0)
        io.in(data.roomId).emit('updateGameStage', 'Набор игроков')
      }
    }
  })
});

app.use('/api', userRouter)
app.use('/api', roomsRouter)


server.listen(PORT, () => {
    console.log(`Server has been started on PORT ${PORT} ...`);
})

// gameStage & gameStatus && description
// collecting
//             'playing' Игра началась
// Игра начнется через: |             countdown - 