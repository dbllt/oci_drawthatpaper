const log = require("./log")
const io = require("./server")
const crypto = require("crypto");

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
            participants: [creator]
        }
        rooms.push(room)
        return room
    },
    joinRoom(roomId, user) {
        const room = this.getRoom(roomId)
        room.participants.push(user)
    },
    leaveRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("Trying to leave non existing room")
        room.participants = room.participants.filter(u => u.id !== user.id);
        if (arrayIsEmpty(room.participants))
            rooms = rooms.filter(r => r.id !== roomId)
    },
}

module.exports = RoomManager


// Chat
io.on("connection", (socket) => {
    const user = socket.decoded_token
    const username = user.username
    log.debug("User: " + username + " is connected")
    socket.on("disconnect", () => {
        log.debug("User: " + username + " disconnected")
    })

    socket.on("connectMeTo", (chatRoom) => {
        log.debug("Connecting " + username + " to chat room " + chatRoom)
        socket.join(chatRoom)

        io.to(chatRoom).emit("game", "newUserInRoom")

        socket.on("chat", (msg) => {
            log.debug("(" + chatRoom + ") (" + username + ") : " + msg)
            io.to(chatRoom).emit("chat", {
                username: username,
                msg: msg
            })
        })
        socket.on("draw", (msg) => {
            log.debug("(" + chatRoom + ") (" + username + ") [draw] : " + msg)
            io.to(chatRoom).emit("draw", msg)
        })

        socket.on("disconnect", () => {
            log.debug("User: " + username + " disconnected")
            RoomManager.leaveRoom(chatRoom, user)
        })
    })
})

function arrayIsEmpty(array) {
    //If it's not an array, return TRUE.
    if (!Array.isArray(array)) {
        return true;
    }
    //If it is an array, check its length property
    if (array.length == 0) {
        //Return TRUE if the array is empty
        return true;
    }
    //Otherwise, return FALSE.
    return false;
}