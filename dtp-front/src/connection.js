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
    }
}
Vue.prototype.$network_events = events

const socketEvents = {
    chat: 'chat'
}

const connection = new Vue()

// Chat
connection.$on(events.Login.success, (result) => {
    var accessToken = result.accessToken
    if (accessToken != undefined) {
        const socket = io.connect(SERVER_URL, {
            extraHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        socket.on('connect', () => {
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
    }
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
                    log.debug("Success !")
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
                    connection.$emit(events.Login.success, JSON.parse(result))
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




Vue.prototype.$connection = connection