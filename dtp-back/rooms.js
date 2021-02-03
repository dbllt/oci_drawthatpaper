const log = require("./log")
const io = require("./server")
const crypto = require("crypto")

var rooms = []
var id = 1
nextId = () => {
    return id++
}

const RoomManager = {
    getRooms() {
        return rooms
    },
    getRoom(id) {
        return rooms.find(r => id == r.id)
    },
    createRoom(name, creator) {
        const roomId = crypto.randomBytes(3).toString("hex") + nextId()
        const room = {
            id: roomId,
            name: name,
            started: false,
            creator: creator,
            participants: []
        }
        rooms.push(room)
        return room
    },
    joinRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("joinRoom: Room doesn't exist")
        if (room.started) {
            log.debug("joinRoom: Game already started")
            return false
        }
        room.participants.push(user)
        return true
    },
    isInRoom(roomId, userId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("isInRoom: Room doesn't exist")
        return room.participants.filter(u => u.id === userId).length > 0
    },
    isValid(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return false
        if (!this.isInRoom(roomId, room.creator.id)) return false
        return room.participants !== null && room.participants.length >= 2
    },
    leaveRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("leaveRoom: Room doesn't exist")
        room.participants = room.participants.filter(u => u.id !== user.id)
        if (arrayIsEmpty(room.participants))
            rooms = rooms.filter(r => r.id !== roomId)
    },
    isCreator(roomId, userId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("isCreator: Room doesn't exist")
        return room.creator.id === userId
    },
    startGame(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("startGame: Room doesn't exist")
        room.started = true
        GameManager.createGame(roomId)
    }
}

module.exports = RoomManager

var game = {}
const GameManager = {
    createGame(roomId) {
        game[roomId] = new Game(roomId, 3, 20)
    },
    processEvent(event, roomId) {
        game[roomId].processEvent(event)
    }
}

const {
    Game
} = require("./game")


// Chat
io.on("connection", (socket) => {
    const user = socket.decoded_token
    const username = user.username
    log.debug("User: " + username + " is connected")
    socket.on("disconnect", () => {
        log.debug("User: " + username + " disconnected")
    })

    socket.on("connectMeTo", (roomId) => {
        log.debug("Connecting " + username + " to chat room " + roomId)

        let joined = RoomManager.joinRoom(roomId, user)
        
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
                RoomManager.leaveRoom(roomId, user)
                io.to(roomId).emit("lobby", "participantsUpdated")
            })

            socket.on("start", () => {
                if (RoomManager.isCreator(roomId, user.id)) {
                    log.debug("creating game")
                    RoomManager.startGame(roomId)
                    io.to(roomId).emit("lobby", "startGame")
                }
            })

            socket.on("game", (event) => {
                log.error(event)
                event.userId = user.id
                GameManager.processEvent(event, roomId)
            })

        }

    })
})

function arrayIsEmpty(array) {
    //If it's not an array, return TRUE.
    if (!Array.isArray(array)) {
        return true
    }
    //If it is an array, check its length property
    if (array.length == 0) {
        //Return TRUE if the array is empty
        return true
    }
    //Otherwise, return FALSE.
    return false
}