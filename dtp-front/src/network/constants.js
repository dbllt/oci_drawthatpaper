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
    SendWordForValidation: "sendWordForValidation",
    StartGame: "startGame",
    PickWord: "pickWord",
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
    ReceiveGoodAnswer: "receiveGoodAnswer",
    PickWord: "pickWordSuccess",
    StartGame: "startingGame",
    GameStateUpdate: "sameStateUpdate",
    Participants: "participants",
    RoundTime: "roundTime",
}
Vue.prototype.$network_events = events

const ui_events = {
    BackButtonPressed: "backButtonPressed",
}
Vue.prototype.$ui_events = ui_events

const GameStates = Object.freeze({
    Starting: 1, // S
    NextPlayer: 2, // Select player then player send word

    Picking: 3,
    Drawing: 4,

    Ended: 5,
    Terminating: 6
});
Vue.prototype.$gameStates = GameStates

Vue.prototype.$connection = new Vue({
    created() {
        window.onpopstate = () => {
            this.$emit(ui_events.BackButtonPressed)
        };
    }
})

Vue.prototype.$server_url = "https://drawthatpaper.istic.univ-rennes1.fr/api"
Vue.prototype.$socket_url = "https://drawthatpaper.istic.univ-rennes1.fr"
//Vue.prototype.$server_url = "http://localhost:3000"
//Vue.prototype.$socket_url = "http://localhost:3000"