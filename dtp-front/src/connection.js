import Vue from 'vue'
import io from 'socket.io-client'

const {
    SERVER_URL = 'http://localhost:3000'
} = process.env

const socket = io(SERVER_URL);

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
socket.on(socketEvents.chat, (data) => connection.$emit(actions.ReceiveMsg, data))
connection.$on(actions.SendMsg, (msg) => {
    socket.emit(socketEvents.chat, msg)
})

// Authentication

// Headers
const myHeaders = new Headers();
myHeaders.append("Host", SERVER_URL);
myHeaders.append("Content-Type", "application/json");

// Register
connection.$on(actions.Register, (user) => {
    console.log("Registering")

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
                    console.log("Success !")
                    connection.$emit(events.Register.success, result)
                } else {
                    connection.$emit(events.Register.error, result)
                }

            })

        })
        .catch(error => {
            console.log('error', error)
            connection.$emit(events.Register.error, error)
        });
})

// Login
connection.$on(actions.Login, (user) => {
    console.log("Loging in")

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
                    connection.$emit(events.Login.success, result)
                } else {
                    connection.$emit(events.Login.error, result)
                }
            })
        })
        .catch(error => {
            console.log('error', error)
            connection.$emit(events.Login.error, error)
        });
})




Vue.prototype.$connection = connection