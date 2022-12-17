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

app.use(express.json());
// app.get('*', (req, res) => {

// })

io.on('connection', (socket) => {
    console.log('Connected');
  });

app.use('/api', userRouter)


server.listen(PORT, () => {
    console.log(`Server has been started on PORT ${PORT} ...`);
})