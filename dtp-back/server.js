require('dotenv').config()
const log = require('./log')
const express = require('express')
const app = express()

const mysql = require('mysql');

const {
    PORT = 3000,
} = process.env

const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', function (socket) {
    log.debug('a user is connected')
    socket.on('disconnect', function () {
        log.debug("A user is disconnected")
    })

    socket.on('chat', function (msg) {
        log.debug("message recu: " + msg)
        io.emit('chat', msg)
    })
})

app.use(express.json())

const userRouter = require('./routes/user')
app.use('/user', userRouter)

const authRouter = require('./routes/auth')
app.use('/', authRouter)


http.listen(PORT, function () {
    log.debug("Server running on, " + PORT)
})