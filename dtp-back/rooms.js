const log = require("./log")
const io = require("./server")

const {
    RoomManager
} = require("./model/room_manager")
const {
    GameManager
} = require("./model/game_manager")

const room_manager = new RoomManager()
const game_manager = new GameManager()

// Room logic with sockets
io.on("connection", (socket) => {
    const user = socket.decoded_token
    const username = user.username
    log.debug("User: " + username + " is connected")
    socket.on("disconnect", () => {
        log.debug("User: " + username + " disconnected")
    })

    socket.on("connectMeTo", (roomId) => {
        log.debug("Connecting " + username + " to chat room " + roomId)

        let joined = room_manager.joinRoom(roomId, user)

        if (joined) {
            socket.join(roomId)
            socket.join(user.id)

            io.to(roomId).emit("lobby", "participantsUpdated")

            socket.on("chat", (msg) => {
                log.debug("(" + roomId + ") (" + username + ") : " + msg)
                io.to(roomId).emit("chat", {
                    username: username,
                    msg: msg
                })
            })
            socket.on("draw", (msg) => {
                io.to(roomId).emit("draw", msg)
            })

            socket.on("disconnect", () => {
                log.debug("User: " + username + " disconnected and leaving room")
                room_manager.leaveRoom(roomId, user)
                io.to(roomId).emit("lobby", "participantsUpdated")
            })

            socket.on("start", () => {
                if (room_manager.isCreator(roomId, user.id)) {
                    log.debug("creating game")
                    room_manager.startGame(roomId)
                    io.to(roomId).emit("lobby", "startGame")
                }
            })

            socket.on("game", (event) => {
                log.error(event)
                event.userId = user.id
                game_manager.processEvent(event, roomId)
            })

        }

    })
})