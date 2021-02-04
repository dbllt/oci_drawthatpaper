const crypto = require("crypto")
const {
    GameManager
} = require("./game_manager")
const game_manager = new GameManager()

class RoomManager {
    constructor() {
        if (RoomManager.exists) {
            return RoomManager.instance
        }
        // Instance don't exist, initialisation of RoomManager
        this._nextId = 1
        this._rooms = []

        RoomManager.instance = this
        RoomManager.exists = true
        return this
    }

    getRooms() {
        return this._rooms
    }

    getRoom(id) {
        return this._rooms.find(r => id == r.id)
    }

    /**
     * Returns the next id possible
     */
    _getNextId() {
        return this._nextId++
    }

    /**
     * Removes the room from the _rooms
     * @param {*} roomId 
     */
    _removeRoom(roomId) {
        this._rooms = this._rooms.filter(r => r.id !== roomId)
    }

    /**
     * Creates a room and adds it to the _rooms
     * @param {*} roomName Name of the room to create
     * @param {*} creator Creator of the room (User)
     */
    createRoom(roomName, creator) {
        const roomId = crypto.randomBytes(3).toString("hex") + this._getNextId()
        const room = {
            id: roomId,
            name: roomName,
            started: false,
            creator: creator,
            participants: []
        }
        this._rooms.push(room)
        return room
    }

    /**
     * Adds the user to the room's participants, returns true if added, false else
     * @param {*} roomId 
     * @param {*} user User to add
     * @returns {boolean}
     */
    joinRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("joinRoom: Room doesn't exist")

        if (room.started) {
            log.debug("joinRoom: Game already started")
            return false
        }

        room.participants.push(user)
        return true
    }

    /**
     * Removes the user from the room's participants
     * @param {*} roomId 
     * @param {*} user User to remove
     */
    leaveRoom(roomId, user) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("leaveRoom: Room doesn't exist")

        room.participants = room.participants.filter(u => u.id !== user.id)
        if (arrayIsEmpty(room.participants))
            this._removeRoom(roomId)
    }

    /**
     * Checks if the user is in the room
     * @param {*} roomId 
     * @param {*} userId 
     * @returns {boolean}
     */
    isInRoom(roomId, userId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("isInRoom: Room doesn't exist")

        return room.participants.filter(u => u.id === userId).length > 0
    }

    /**
     * Checks if the user is the creator of the room
     * @param {*} roomId 
     * @param {*} userId 
     */
    isCreator(roomId, userId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("isCreator: Room doesn't exist")

        return room.creator.id === userId
    }

    /**
     * Starts a game in the room
     * @param {*} roomId 
     */
    startGame(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return log.error("startGame: Room doesn't exist")

        room.started = true
        game_manager.createGame(roomId)
    }

}

module.exports.RoomManager = RoomManager

function arrayIsEmpty(array) {
    //If it's not an array, return TRUE.
    if (!Array.isArray(array)) {
        return true
    }
    //If it is an array, check its length property
    if (array.length == 0) {
        //Return TRUE if the array is empty
        return true
    }
    //Otherwise, return FALSE.
    return false
}