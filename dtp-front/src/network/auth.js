import Vue from 'vue'
import log from '@/log'

const {
    SERVER_URL = 'http://localhost:3000'
} = process.env
const connection = Vue.prototype.$connection
const events = Vue.prototype.$network_events
const actions = Vue.prototype.$network_actions

var auth = undefined

function isExpired(auth) {
    if (auth)
        return (Date.now() - auth.createdAt) > auth.expiresIn
}

// Headers
function getHeaders() {
    const myHeaders = new Headers();
    myHeaders.append("Host", SERVER_URL);
    myHeaders.append("Content-Type", "application/json");
    if (auth && !isExpired(auth))
        myHeaders.append("Authorization", "Bearer " + auth.accessToken)
    return myHeaders
}
var authentication = {
    getAccessToken() {
        if (this.isConnected()) return auth.accessToken
    },
    setAuth(newAuth) {
        auth = newAuth
        auth.createdAt = Date.now()
    },
    isConnected() {
        return auth && !isExpired(auth)
    },
    requestOptions(body, method) {
        var m = 'POST'
        if (method) m = method
        return {
            method: m,
            headers: getHeaders(),
            body: body,
            redirect: 'follow'
        };
    }
}
export default authentication

// Login
connection.$on(actions.Login, (user) => {
    if (authentication.isConnected()) return log.error('User already logged in')

    log.debug("Loging in")

    var body = JSON.stringify({
        "email": user.email,
        "password": user.password
    });

    fetch(SERVER_URL + "/login", authentication.requestOptions(body))
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    authentication.setAuth(JSON.parse(result))
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

// Register
connection.$on(actions.Register, (user) => {
    log.debug("Registering")

    var body = JSON.stringify({
        "username": user.username,
        "email": user.email,
        "password": user.password
    });

    fetch(SERVER_URL + "/register", authentication.requestOptions(body))
        .then(response => {

            response.text().then(result => {
                // Security vulnerability noted, https://stackoverflow.com/a/32531069/13905908
                // In a finished application we would need to change to way we handle this error.
                if (response.status == 201) {
                    log.debug("User registered")
                    connection.$emit(events.Register.success, result)
                } else {
                    log.error(result)
                    connection.$emit(events.Register.error, result)
                }

            })

        })
        .catch(error => {
            log.debug('error', error)
            connection.$emit(events.Register.error, error)
        });
})