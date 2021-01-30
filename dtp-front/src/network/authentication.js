import Vue from "vue"

const SERVER_URL = Vue.prototype.$server_url

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
    getRefreshToken() {
        if (this.isConnected()) return auth.refreshToken
    },
    setAuth(newAuth) {
        auth = newAuth
        auth.createdAt = Date.now()
    },
    disconnect() {
        auth = undefined
    },
    isConnected() {
        return auth && !isExpired(auth)
    },
    requestOptions(body, method) {
        var m = "POST"
        if (method) m = method
        return {
            method: m,
            headers: getHeaders(),
            body: body,
            redirect: "follow"
        };
    }
}
export default authentication