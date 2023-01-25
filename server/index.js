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
const roomsRouter = require('./routes/rooms.routes');

app.use(express.json());
// app.get('*', (req, res) => {

// })

const mySocket = require('./socket/index')

io.on('connection', mySocket);

app.use('/api', userRouter)
app.use('/api', roomsRouter)


server.listen(PORT, () => {
    console.log(`Server has been started on PORT ${PORT} ...`);
})