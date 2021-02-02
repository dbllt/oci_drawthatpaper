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
        const roomId = crypto.randomBytes(5).toString("hex") + nextId()
        const room = {
            id: roomId,
            name: name,
            creator: creator,
            participants: []
        }
        rooms.push(room)
        return room
    },
    joinRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("Cannot join unexisting room")
        room.participants.push(user)
    },
    isInRoom(roomId, userId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("Room doesn't exist")
        return room.participants.filter(u => u.id === userId).length > 0
    },
    isValid(roomId){
        const room = this.getRoom(roomId)
        if (!room) return false
        return room.participants !== null && room.participants.length >= 1
    },
    leaveRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("Trying to leave non existing room")
        room.participants = room.participants.filter(u => u.id !== user.id)
        if (arrayIsEmpty(room.participants))
            rooms = rooms.filter(r => r.id !== roomId)
    },
}

module.exports = RoomManager

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
        socket.join(roomId)

        RoomManager.joinRoom(roomId, user)

        io.to(roomId).emit("lobby", "participantsUpdated")

        socket.on("chat", (msg) => {
            log.debug("(" + roomId + ") (" + username + ") : " + msg)
            io.to(roomId).emit("chat", {
                username: username,
                msg: msg
            })
        })
        socket.on("draw", (msg) => {
            log.debug("(" + roomId + ") (" + username + ") [draw] : " + msg)
            io.to(roomId).emit("draw", msg)
        })

        socket.on("disconnect", () => {
            log.debug("User: " + username + " disconnected and leaving room")
            RoomManager.leaveRoom(roomId, user)
            io.to(roomId).emit("lobby", "participantsUpdated")
        })

        socket.on("start",()=>{
            new Game(roomId, 3, 1000)
        })
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