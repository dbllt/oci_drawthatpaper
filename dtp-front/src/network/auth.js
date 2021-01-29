import Vue from "vue"
import log from "@/log"
import authentication from "@/network/authentication"

const SERVER_URL = Vue.prototype.$server_url
const connection = Vue.prototype.$connection
const events = Vue.prototype.$network_events
const actions = Vue.prototype.$network_actions

// Login
connection.$on(actions.Login, (user) => {
    if (authentication.isConnected()) return log.error("User already logged in")

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
            log.debug("error", error)
            connection.$emit(events.Login.error, error)
        });
})

// Logout
connection.$on(actions.Logout, () => {
    if (!authentication.isConnected()) return log.error("User already logged out")

    log.debug("Loging out")

    var body = JSON.stringify({
        "refreshToken": authentication.getRefreshToken(),
    });

    fetch(SERVER_URL + "/logout", authentication.requestOptions(body, "DELETE"))
        .then(response => {
            response.text().then(result => {
                if (response.status == 204) {
                    authentication.disconnect()
                    connection.$emit(events.Logout, "Logged out")
                } else {
                    log.error("There was an error while logging out ", result)
                }
            })
        })
        .catch(error => {
            log.debug("error", error)
            connection.$emit(events.Logout.error, error)
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
            log.debug("error", error)
            connection.$emit(events.Register.error, error)
        });
})