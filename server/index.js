const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(cors())
app.use(express.json()); //сервер теперь умеет парсить json из запросов

const PORT = process.env.SERVER_PORT || 3000
const mySocket = require('./socket/index')

const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*', //"http://localhost:5000"
  }
});

io.on('connection', mySocket);

const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
const userRouter = require('./routes/user.routes')
const roomsRouter = require('./routes/rooms.routes');

app.use('/api', authRouter)
app.use('/api', adminRouter)
app.use('/api', userRouter)
app.use('/api', roomsRouter)

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server has been started on PORT ${PORT} ...`))
  } catch (error) {
    console.log(error);
  }
}

start()