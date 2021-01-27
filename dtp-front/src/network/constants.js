import Vue from 'vue'

const actions = {
    SendMsg: "sendMessage",
    SendDraw: "sendDraw",
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
    ReceiveDraw: "receiveDraw",
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
