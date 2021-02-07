import Vue from "vue"
import log from "@/log"
import io from "socket.io-client"
import authentication from "@/network/authentication"

const SOCKET_URL = Vue.prototype.$socket_url
const connection = Vue.prototype.$connection
const events = Vue.prototype.$network_events
const actions = Vue.prototype.$network_actions

const socketEvents = {
    chat: "chat",
    draw: "draw",
    game: "game",
    connectMeTo: "connectMeTo",
    start: "start",
    lobby: "lobby"
}

const lobbyEvents = {
    participantsUpdated: "participantsUpdated",
    startGame: "startGame",
    connected: "connected",
}

const types = {
    players: "players",
    state: "state",
    round: "round",
    next_word: "next_word",
    score: "score",
    word_validity: "word_validity",
    pick: "pick"
}

let packetForServer = function (type, data) {
    return {
        "type": type,
        "data": data
    }
}

// Connection to chat
var connectedToChat = false
connection.$on(actions.ConnectToChat, (chatRoom) => {
    if (!chatRoom) return log.error("No chat room specified")
    if (!authentication.isConnected()) return log.error("User not logged in")
    if (connectedToChat) return log.error("Already connected to chat")

    log.debug("Connecting to chat")

    const socket = io.connect(SOCKET_URL, {
        extraHeaders: {
            Authorization: `Bearer ${authentication.getAccessToken()}`
        }
    })
    connection.$on(actions.LeaveRoom, () => socket.disconnect())

    socket.on("connect", () => {
        log.debug("Connected to chat")
        connectedToChat = true
        socket.emit(socketEvents.connectMeTo, chatRoom)

        connection.$on(actions.SendMsg, (msg) => {
            if (msg) socket.emit(socketEvents.chat, msg)
        })
        connection.$on(actions.SendDraw, (msg) => {
            if (msg) socket.emit(socketEvents.draw, msg)
        })
        connection.$on(actions.StartGame, () => {
            log.debug("Starting game")
            socket.emit(socketEvents.start)
        })
        connection.$on(actions.PickWord, (word) => {
            log.debug("Picked a word")
            socket.emit(socketEvents.game, packetForServer(types.pick, word))
        })
        connection.$on(actions.SendWordForValidation, (word) => {
            log.debug("Send word for validation")
            if (word) socket.emit(socketEvents.game, packetForServer(types.word_validity, word));
        })
    })

    socket.on(socketEvents.chat, (data) => {
        if (connectedToChat) connection.$emit(events.ReceiveMsg, data)
    })
    socket.on(socketEvents.draw, (data) => {
        if (connectedToChat) connection.$emit(events.ReceiveDraw, data)
    })
    socket.on(socketEvents.game, (data) => {
        if (!connectedToChat) return
        
        var json = JSON.parse(data)
        switch (json.type) {
            case types.players:
                log.debug("players")
                connection.$emit(events.Participants, json.data.participants)
                break
            case types.state:
                connection.$emit(events.GameStateUpdate, json.data)
                log.debug("state")
                break
            case types.round:
                connection.$emit(events.RoundTime, json.data.round_time)
                log.debug("round")
                break
            case types.next_word:
                log.debug("next_word")
                break
            case types.score:
                // old
                log.debug("score")
                break
            case types.word_validity:
                log.debug("word_validity")
                connection.$emit(events.ReceiveGoodAnswer, json.data)
                break
            case types.pick:
                log.debug("pick")
                if (authentication.isMe(json.data.drawing_user_id))
                    connection.$emit(events.PickWord, json.data.words)
                break
        }
    })

    socket.on(socketEvents.lobby, (event) => {
        switch (event) {
            case lobbyEvents.participantsUpdated:
                connection.$emit(events.ParticipantsUpdated)
                log.debug("Someone joined or left the room")
                break
            case lobbyEvents.startGame:
                connection.$emit(events.StartGame)
                log.debug("Creator started the game")
                break
            case lobbyEvents.connected:
                connection.$emit(events.ConnectedToRoom)
                log.debug("User connected to the room")
                break
        }
    })

    socket.on("unauthorized", (error) => {
        if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
            // redirect user to login page perhaps?
            log.debug("User token has expired");
        }
    });

    socket.on("disconnect", () => {
        log.debug("Disconnected from chat")
        connectedToChat = false
    })
})