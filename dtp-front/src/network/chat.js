import Vue from 'vue'
import log from '@/log'
import io from 'socket.io-client'
import authentication from '@/network/auth'
const {
    SERVER_URL = 'https://drawthatpaper.istic.univ-rennes1.fr'
    // SERVER_URL = 'http://localhost:3000'
} = process.env
const connection = Vue.prototype.$connection
const events = Vue.prototype.$network_events
const actions = Vue.prototype.$network_actions

const socketEvents = {
    chat: 'chat',
    connectMeTo: 'connectMeTo'
}

// Connection to chat
var connectedToChat = false
connection.$on(actions.ConnectToChat, (chatRoom) => {
    if (!chatRoom) return log.error('No chat room specified')
    if (!authentication.isConnected()) return log.error("User not logged in")
    if (connectedToChat) return log.error('Already connected to chat')

    log.debug('Connecting to chat')

    const socket = io.connect(SERVER_URL, {
        extraHeaders: {
            Authorization: `Bearer ${authentication.getAccessToken()}`
        }
    })

    socket.on('connect', () => {
        log.debug('Connected to chat')
        connectedToChat = true
        socket.emit(socketEvents.connectMeTo, chatRoom)

        socket.on(socketEvents.chat, (data) => connection.$emit(events.ReceiveMsg, data))

        connection.$on(actions.SendMsg, (msg) => {
            if (msg) socket.emit(socketEvents.chat, msg)
        })
    })

    socket.on('unauthorized', (error) => {
        if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
            // redirect user to login page perhaps?
            log.debug('User token has expired');
        }
    });

    socket.on('disconnect', () => {
        log.debug('Disconnected from chat')
        connectedToChat = false
    })
})