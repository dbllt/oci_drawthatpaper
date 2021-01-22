import Vue from 'vue'

const actions = {
    SendMsg: "sendMessage",
    Register: "register",
    Login: "login",
    Logout: "logout",
    CreateRoom: "createRoom",
    JoinRoom: "joinRoom",
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
    CreateRoom: {
        success: "createRoomSuccess",
        error: "createRoomError",
    },
    JoinRoom: {
        success: "joinRoomSuccess",
        error: "joinRoomError",
    },
    Logout: "logoutSuccess",
}
Vue.prototype.$network_events = events

Vue.prototype.$connection = new Vue()
