const express = require('express')
var cors = require('cors')
const PORT = process.env.PORT || 3000

const userRouter = require('./routes/user.routes')

const app = express();
app.use(express.json());
app.use(cors())
// app.get('*', (req, res) => {

// })

app.use('/api', userRouter)


app.listen(PORT, () => {
    console.log(`Server has been started on PORT ${PORT} ...`);
})