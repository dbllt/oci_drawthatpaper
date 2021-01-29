require('dotenv').config()
const log = require('./log')
const express = require('express')
const app = express()

var cors = require('cors')

const {
    PORT = 3000,  ACCESS_TOKEN_SECRET
} = process.env

// Chat
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})
const socketioJwt = require('socketio-jwt');

io.use(socketioJwt.authorize({
    secret: ACCESS_TOKEN_SECRET,
    handshake: true,
    callback: false,
    auth_header_required: true
}))

// Middleware to disconnect expired sockets
const timer = require('long-timeout')
io.use((socket, next) => {
    const decodedToken = socket.decoded_token // Assuming the decoded user is save on socket.user

    if (!decodedToken.exp) return next()

    const expiresIn = (decodedToken.exp - Date.now() / 1000) * 1000
    const timeout = timer.setTimeout(() => socket.disconnect(true), expiresIn)
    socket.on('disconnect', () => timer.clearTimeout(timeout))

    return next()
})

module.exports = io
require('./rooms')

// API
app.use(express.json())
app.use(cors())

const userRouter = require('./routes/user')
app.use('/user', userRouter)

const roomsRouter = require('./routes/roomsRouter')
app.use('/rooms', roomsRouter)

const authRouter = require('./routes/auth')
app.use('/', authRouter)

http.listen(PORT, function () {
    log.debug("Server running on, " + PORT)
})