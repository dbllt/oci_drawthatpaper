import Vue from 'vue'
import io from 'socket.io-client'
const log = require('./log')

const {
    SERVER_URL = 'http://localhost:3000'
} = process.env

const actions = {
    SendMsg: "sendMessage",
    Register: "register",
    Login: "login",
    Logout: "logout",
    ConnectToChat: "connectToChat",
}
Vue.prototype.$network_actions = actions

const events = {
    ReceiveMsg: "receiveMessage",
    Register: {
        success: "registerSuccess",
        error: "registerError",
    },
    Login: {
        success: "loginSuccess",
        error: "loginError",
    },
    Logout: "logoutSuccess",
}
Vue.prototype.$network_events = events

const socketEvents = {
    chat: 'chat'
}

const connection = new Vue()

var auth = undefined

// Connection to chat
var connectedToChat = false
connection.$on(actions.ConnectToChat, () => {
    if (!auth) {
        log.error("User not logged in")
        return
    }
    if (connectedToChat) {
        log.error('Already connected to chat')
        return
    }

    log.debug("Attempting connection to chat")

    const socket = io.connect(SERVER_URL, {
        extraHeaders: {
            Authorization: `Bearer ${auth.accessToken}`
        }
    })

    socket.on('connect', () => {
        log.debug('Connected to chat')
        connectedToChat = true

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

// Authentication

// Headers
const myHeaders = new Headers();
myHeaders.append("Host", SERVER_URL);
myHeaders.append("Content-Type", "application/json");

// Register
connection.$on(actions.Register, (user) => {
    log.debug("Registering")

    var raw = JSON.stringify({
        "username": user.username,
        "email": user.email,
        "password": user.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(SERVER_URL + "/register", requestOptions)
        .then(response => {

            response.text().then(result => {
                // Security vulnerability noted, https://stackoverflow.com/a/32531069/13905908
                // In a finished application we would need to change to way we handle this error.
                if (response.status == 201) {
                    log.debug("User registered")
                    connection.$emit(events.Register.success, result)
                } else {
                    connection.$emit(events.Register.error, result)
                }

            })

        })
        .catch(error => {
            log.debug('error', error)
            connection.$emit(events.Register.error, error)
        });
})

// Login
connection.$on(actions.Login, (user) => {
    if (auth && ! isExpired(auth)) {
        log.error('User already logged in')
        return
    }

    log.debug("Loging in")

    var raw = JSON.stringify({
        "email": user.email,
        "password": user.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(SERVER_URL + "/login", requestOptions)
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    auth = JSON.parse(result)
                    auth.createdAt = Date.now()
                    connection.$emit(events.Login.success, "Logged in")
                } else {
                    connection.$emit(events.Login.error, result)
                }
            })
        })
        .catch(error => {
            log.debug('error', error)
            connection.$emit(events.Login.error, error)
        });
})

function isExpired(auth) {
    if (auth)
        return (Date.now() - auth.createdAt) > auth.expiresIn
}


Vue.prototype.$connection = connection