import Vue from "vue"

const actions = {
    SendMsg: "sendMessage",
    SendDraw: "sendDraw",
    Register: "register",
    Login: "login",
    Logout: "logout",
    CreateRoom: "createRoom",
    JoinRoom: "joinRoom",
    LeaveRoom: "leaveRoom",
    GetAllRooms: "getAllRooms",
    GetOneRoom: "getOneRoom",
    ConnectToChat: "connectToChat",
}
Vue.prototype.$network_actions = actions

const events = {
    ReceiveMsg: "receiveMessage",
    ReceiveDraw: "receiveDraw",
    ParticipantsUpdated: "participantsUpdated",
    Register: {
        success: "registerSuccess",
        error: "registerError",
    },
    Login: {
        success: "loginSuccess",
        error: "loginError",
    },
    Logout: "logoutSuccess",
    CreateRoom: {
        success: "createRoomSuccess",
        error: "createRoomError",
    },
    JoinRoom: {
        success: "joinRoomSuccess",
        error: "joinRoomError",
    },
    GetAllRooms: {
        success: "getAllRoomsSuccess",
        error: "getAllRoomsError",
    },
    GetOneRoom: {
        success: "getOneRoomSuccess",
        error: "getOneRoomError",
    },
}
Vue.prototype.$network_events = events

Vue.prototype.$connection = new Vue()

Vue.prototype.$server_url = "https://drawthatpaper.istic.univ-rennes1.fr/api"
Vue.prototype.$socket_url = "https://drawthatpaper.istic.univ-rennes1.fr"
//Vue.prototype.$server_url = "http://localhost:3000"
//Vue.prototype.$socket_url = "http://localhost:3000"
