import Vue from "vue"
import log from "@/log"
import authentication from "@/network/auth"

const SERVER_URL = Vue.prototype.$server_url
const connection = Vue.prototype.$connection
const events = Vue.prototype.$network_events
const actions = Vue.prototype.$network_actions

// Create room
connection.$on(actions.CreateRoom, (room) => {
    if (!room || !room.name) return log.error("No name specified for the room")
    if (!authentication.isConnected()) return log.error("User not logged in")

    log.debug("Creating room : " + room.name)

    var body = JSON.stringify({
        "name": room.name,
    });

    fetch(SERVER_URL + "/rooms", authentication.requestOptions(body))
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    const room = JSON.parse(result)
                    connection.$emit(actions.ConnectToChat, room.chatRoom)
                    connection.$emit(events.CreateRoom.success, room)
                } else {
                    log.error("Room not created")
                    connection.$emit(events.CreateRoom.error, result)
                }
            })
        })
        .catch(error => {
            log.debug("error", error)
            connection.$emit(events.CreateRoom.error, error)
        });
})

// Join room
connection.$on(actions.JoinRoom, (roomId) => {
    if (!roomId) return log.error("No room specified")
    if (!authentication.isConnected()) return log.error("User not logged in")

    log.debug("Joining room : " + roomId)

    fetch(SERVER_URL + "/rooms/" + roomId, authentication.requestOptions(null, "PUT"))
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    const room = JSON.parse(result)
                    connection.$emit(actions.ConnectToChat, room.chatRoom)
                    connection.$emit(events.JoinRoom.success, room)
                } else {
                    log.error("Room not joined")
                    connection.$emit(events.JoinRoom.error, result)
                }
            })
        })
        .catch(error => {
            log.debug("error", error)
            connection.$emit(events.CreateRoom.error, error)
        });
})

// Get all rooms
connection.$on(actions.GetAllRooms, () => {
    if (!authentication.isConnected()) return log.error("User not logged in")

    log.debug("Getting all rooms")

    fetch(SERVER_URL + "/rooms/", authentication.requestOptions(null, "GET"))
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    const rooms = JSON.parse(result)
                    connection.$emit(events.GetAllRooms.success, rooms)
                } else {
                    log.error("Room not joined")
                    connection.$emit(events.GetAllRooms.error, result)
                }
            })
        })
        .catch(error => {
            log.debug("error", error)
            connection.$emit(events.GetAllRooms.error, error)
        });
})

// Get one room
connection.$on(actions.GetOneRoom, (roomId) => {
    if (!roomId) return log.error("No room specified")
    if (!authentication.isConnected()) return log.error("User not logged in")

    log.debug("Getting one room")

    fetch(SERVER_URL + "/rooms/" + roomId, authentication.requestOptions(null, "GET"))
        .then(response => {
            response.text().then(result => {
                if (response.status == 200) {
                    const room = JSON.parse(result)
                    connection.$emit(events.GetOneRoom.success, room)
                } else {
                    log.error("Did not get room")
                    connection.$emit(events.GetOneRoom.error, result)
                }
            })
        })
        .catch(error => {
            log.debug("error", error)
            connection.$emit(events.GetOneRoom.error, error)
        });
})