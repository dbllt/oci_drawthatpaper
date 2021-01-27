const io = require("./server")
const log = require("./log")

// Chat
io.on("connection", (socket) => {
    const username = socket.decoded_token.username
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
    })
})