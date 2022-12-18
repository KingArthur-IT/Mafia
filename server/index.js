const {rooms} = require('./data')


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

const userRouter = require('./routes/user.routes')
const roomsRouter = require('./routes/rooms.routes')

app.use(express.json());
// app.get('*', (req, res) => {

// })

io.on('connection', (socket) => {
    console.log('Connected');

    socket.on('enterRoom', (data, cb) => {
      if (!data.userId || !data.roomId){
        return cb({status: 'error', text: 'Данные пользователя не корректны'})
      } else {
        cb({status: 'ok'});
        const chatMsg = {author: 'server', text: `Присоединился пользователь ${data.nickname}`};
        rooms.find(room => room.id === data.roomId).chat.push(chatMsg);
        socket.emit('newChatMsg', chatMsg)
      }
    })
});

app.use('/api', userRouter)
app.use('/api', roomsRouter)


server.listen(PORT, () => {
    console.log(`Server has been started on PORT ${PORT} ...`);
})